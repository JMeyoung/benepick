import asyncio
import base64
import json
from datetime import datetime
from pathlib import Path
import anthropic
from playwright.async_api import async_playwright

SOURCE_URL = "https://www.lguplus.com/benefit-membership"
OUTPUT_DIR = Path("lgu_screenshots")
OUTPUT_JSON = Path("lgu_benefits.json")
VIEWPORT = {"width": 1280, "height": 800}
TODAY = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
TODAY_DATE = datetime.now()

VISION_PROMPT = f"""이 스크린샷은 LG U+ 멤버십 혜택 페이지입니다.
화면에 보이는 혜택 카드들을 분석해서 아래 JSON 배열 형식으로 추출해주세요.
혜택 카드가 없는 화면은 빈 배열 [] 반환.
반드시 JSON 배열만 반환, 다른 텍스트 금지.
D-N 표시가 있으면 오늘({TODAY_DATE.strftime("%Y-%m-%d")}) 기준으로 N일 후 날짜를 endsAt에 ISO8601로 기입.

카테고리: CAFE_FOOD(카페/음식점) | SHOPPING(마트/쇼핑) | CULTURE(영화/공연) | TRANSPORT(교통/주유) | HEALTH(헬스/병원) | ETC

[
  {{
    "title": "브랜드명 + 핵심 혜택",
    "summary": "한 줄 요약 (20자 이내)",
    "description": "상세 조건 및 유의사항",
    "category": "CAFE_FOOD",
    "status": "PUBLISHED",
    "sourceUrl": "{SOURCE_URL}",
    "sourceUpdatedAt": "{TODAY}",
    "endsAt": "날짜 또는 null",
    "isFeatured": false,
    "region": null
  }}
]"""

async def crawl_screenshots():
    OUTPUT_DIR.mkdir(exist_ok=True)
    screenshots = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport=VIEWPORT)
        print(f"[1단계] 페이지 접속 중...")
        await page.goto(SOURCE_URL, timeout=60000)
        await page.wait_for_load_state("domcontentloaded")
        await asyncio.sleep(3)
        total_height = await page.evaluate("document.body.scrollHeight")
        scroll_step = VIEWPORT["height"] - 150
        scroll_pos = 0
        idx = 0
        while scroll_pos < total_height:
            await page.evaluate(f"window.scrollTo(0, {scroll_pos})")
            await asyncio.sleep(0.8)
            filename = OUTPUT_DIR / f"shot_{idx:03d}.png"
            await page.screenshot(path=str(filename), type="png")
            screenshots.append(str(filename))
            print(f"  캡처: {filename.name}")
            scroll_pos += scroll_step
            idx += 1
            total_height = await page.evaluate("document.body.scrollHeight")
        await browser.close()
    print(f"[1단계] 완료 → {len(screenshots)}장\n")
    return screenshots

def analyze_screenshot(client, path):
    with open(path, "rb") as f:
        image_b64 = base64.standard_b64encode(f.read()).decode("utf-8")
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": [
            {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": image_b64}},
            {"type": "text", "text": VISION_PROMPT}
        ]}]
    )
    raw = response.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    try:
        result = json.loads(raw)
        return result if isinstance(result, list) else []
    except:
        return []

def run_vision_analysis(screenshots):
    client = anthropic.Anthropic()
    all_benefits = []
    seen_titles = set()
    print("[2단계] Claude Vision 분석 시작")
    for i, path in enumerate(screenshots, 1):
        print(f"  분석 중: ({i}/{len(screenshots)}) {Path(path).name}")
        benefits = analyze_screenshot(client, path)
        new_count = 0
        for b in benefits:
            title = b.get("title", "").strip()
            if title and title not in seen_titles:
                seen_titles.add(title)
                all_benefits.append(b)
                new_count += 1
        print(f"    → 신규 {new_count}개 (누적: {len(all_benefits)}개)")
    print(f"[2단계] 완료 → 총 {len(all_benefits)}개\n")
    return all_benefits

def save_results(benefits):
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(benefits, f, ensure_ascii=False, indent=2)
    print(f"[3단계] 저장 완료 → {OUTPUT_JSON}")
    print(f"\n✅ 완료! 총 {len(benefits)}개 혜택 수집")
    for b in benefits[:3]:
        print(f"  - [{b.get('category')}] {b.get('title')}")

async def main():
    print("\n" + "="*40)
    print("  LG U+ 혜택 크롤링 파이프라인")
    print("="*40 + "\n")
    screenshots = await crawl_screenshots()
    benefits = run_vision_analysis(screenshots)
    save_results(benefits)

if __name__ == "__main__":
    asyncio.run(main())
