import { CategoryCode } from "../constants";

export interface ParsedBenefit {
  title: string;
  summary: string;
  description: string;
  category: CategoryCode;
  endsAt?: string; // Format: YYYY-MM-DD
}

/**
 * Automatically determines the category code based on keywords found in the text.
 */
function autoDetermineCategory(text: string): CategoryCode {
  const lowerText = text.toLowerCase();
  
  const cafeFoodKeywords = [
    "스타벅스", "폴바셋", "투썸", "할리스", "이디야", "커피", "카페", "cafe", "coffee",
    "빕스", "vips", "아웃백", "매드포갈릭", "도미노", "피자", "bhc", "치킨", "굽네",
    "뚜레쥬르", "파리바게뜨", "파리크라상", "배스킨라빈스", "배스킨", "던킨", "도넛", "제과", "베이커리", "식음료"
  ];
  const shoppingKeywords = [
    "이마트", "롯데마트", "홈플러스", "gs the fresh", "더프레시", "쇼핑", "shopping", "다이소", "11번가", "ssg", "g마켓", "옥션", "쿠팡", "백화점", "아울렛"
  ];
  const cultureKeywords = [
    "cgv", "롯데시네마", "메가박스", "영화", "movie", "롯데월드", "에버랜드", "아쿠아리움", "뮤지컬", "전시", "미술관", "테마파크", "플레이", "play"
  ];
  const transportKeywords = [
    "쏘카", "그린카", "제주항공", "티웨이", "항공", "주차", "렌터카", "ktx", "기차", "택시", "카카오T", "이동", "교통", "주유", "gs칼텍스", "sk에너지"
  ];
  const beautyHealthKeywords = [
    "올리브영", "롭스", "랄라블라", "화장품", "네일", "헤어", "피트니스", "안과", "치과", "병원", "영양제"
  ];
  const educationKeywords = [
    "인강", "학원", "교육", "도서", "교보문고", "sam", "예스24", "알라딘", "외국어", "야나두", "스피킹"
  ];
  const financeKeywords = [
    "카드", "은행", "페이", "네이버페이", "카카오페이", "토스", "포인트", "적립금", "캐시백", "투자"
  ];

  if (cafeFoodKeywords.some(kw => lowerText.includes(kw))) return "CAFE_FOOD";
  if (shoppingKeywords.some(kw => lowerText.includes(kw))) return "SHOPPING";
  if (cultureKeywords.some(kw => lowerText.includes(kw))) return "CULTURE";
  if (transportKeywords.some(kw => lowerText.includes(kw))) return "TRANSPORT";
  if (beautyHealthKeywords.some(kw => lowerText.includes(kw))) return "BEAUTY_HEALTH";
  if (educationKeywords.some(kw => lowerText.includes(kw))) return "EDUCATION";
  if (financeKeywords.some(kw => lowerText.includes(kw))) return "FINANCE";
  
  // Default fallback is LIFE (생활)
  return "LIFE";
}

/**
 * Parses raw text copied from mobile apps or website pages into structured benefits.
 * Supports parsing blocks separated by double newlines.
 */
export function parseBenefitText(text: string): ParsedBenefit[] {
  if (!text || !text.trim()) return [];

  // Split by double newlines or similar block dividers (e.g. multiple blank lines)
  const blocks = text.split(/\n\s*\n+/);
  const parsedList: ParsedBenefit[] = [];

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) continue;

    // Line 0 is usually the Brand/Merchant Name (e.g. "뚜레쥬르", "GS25")
    const brandName = lines[0];

    let summary = "";
    let descriptionLines: string[] = [];

    if (lines.length === 1) {
      summary = "상세 혜택 참고";
      descriptionLines = [brandName];
    } else if (lines.length === 2) {
      summary = lines[1];
      descriptionLines = [lines[1]];
    } else {
      // Line 1 is often the summary (discount amount etc.)
      summary = lines[1];
      // Remaining lines contain criteria, terms, caps etc.
      descriptionLines = lines.slice(2);
    }

    const description = descriptionLines.join("\n");
    const category = autoDetermineCategory(`${brandName} ${summary} ${description}`);

    // Try to parse endsAt date from text (e.g. "2026.12.31 까지", "2026-06-30 까지", "~ 26.12.31")
    let endsAt: string | undefined = undefined;
    const dateRegex = /(\d{4})[-./](\d{1,2})[-./](\d{1,2})/;
    const dateMatch = (summary + " " + description).match(dateRegex);
    
    if (dateMatch) {
      const year = dateMatch[1];
      const month = dateMatch[2].padStart(2, '0');
      const day = dateMatch[3].padStart(2, '0');
      endsAt = `${year}-${month}-${day}`;
    } else {
      // Try YY.MM.DD
      const shortDateRegex = /\b(\d{2})[-./](\d{1,2})[-./](\d{1,2})\b/;
      const shortDateMatch = (summary + " " + description).match(shortDateRegex);
      if (shortDateMatch) {
        const year = `20${shortDateMatch[1]}`;
        const month = shortDateMatch[2].padStart(2, '0');
        const day = shortDateMatch[3].padStart(2, '0');
        endsAt = `${year}-${month}-${day}`;
      }
    }

    parsedList.push({
      title: `${brandName} ${summary}`.trim().substring(0, 50),
      summary: summary.substring(0, 100),
      description,
      category,
      endsAt
    });
  }

  return parsedList;
}
