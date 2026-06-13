"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseBenefitText, ParsedBenefit } from "@/lib/parsers/benefitParser";
import { CATEGORIES } from "@/lib/constants";
import { importBenefitsAction } from "@/app/actions/admin-import";

interface Organization {
  id: string;
  name: string;
  type: string;
}

interface ImportClientProps {
  organizations: Organization[];
}

export function ImportClient({ organizations }: ImportClientProps) {
  const router = useRouter();
  const [selectedOrg, setSelectedOrg] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [parsedBenefits, setParsedBenefits] = useState<ParsedBenefit[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParse = () => {
    if (!rawText.trim()) {
      toast.error("분석할 텍스트를 입력해 주세요.");
      return;
    }
    try {
      const results = parseBenefitText(rawText);
      if (results.length === 0) {
        toast.warning("분석 결과 추출된 혜택 항목이 없습니다. 줄바꿈 구분을 확인해 보세요.");
      } else {
        setParsedBenefits(results);
        toast.success(`${results.length}개의 혜택 항목을 추출했습니다.`);
      }
    } catch (err) {
      console.error(err);
      toast.error("텍스트 분석 중 오류가 발생했습니다.");
    }
  };

  const handleFieldChange = (index: number, field: keyof ParsedBenefit, value: string) => {
    const updated = [...parsedBenefits];
    updated[index] = { ...updated[index], [field]: value };
    setParsedBenefits(updated);
  };

  const handleDeleteRow = (index: number) => {
    const updated = parsedBenefits.filter((_, i) => i !== index);
    setParsedBenefits(updated);
    toast.info("해당 항목을 제외했습니다.");
  };

  const handleSave = async () => {
    if (!selectedOrg) {
      toast.error("제공사 조직을 선택해 주세요.");
      return;
    }
    if (!sourceUrl.trim()) {
      toast.error("공식 출처 URL을 입력해 주세요.");
      return;
    }
    if (parsedBenefits.length === 0) {
      toast.error("임포트할 혜택 항목이 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await importBenefitsAction(selectedOrg, sourceUrl, parsedBenefits);
      if (res.success) {
        toast.success(`성공적으로 ${res.count}개의 혜택을 DB에 임포트했습니다.`);
        router.push("/admin/benefits");
      } else {
        toast.error(res.error || "저장에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      toast.error("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>텍스트 복사-붙여넣기 혜택 임포트</CardTitle>
          <CardDescription>
            통신사(SKT, LGU+ 등)나 제휴사 모바일 앱에서 복사한 텍스트를 아래 입력창에 붙여넣어 빠르게 파싱하고 적재할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization">제공사 (조직) 선택</Label>
              <select
                id="organization"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- 조직 선택 --</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.type})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sourceUrl">공식 출처 URL</Label>
              <Input
                id="sourceUrl"
                type="url"
                placeholder="https://tmembership.tworld.co.kr/..."
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rawText">혜택 복사 텍스트 붙여넣기</Label>
            <div className="text-xs text-muted-foreground mb-1">
              * 각 혜택 블록은 <strong>엔터를 두 번 쳐서(빈 줄로)</strong> 구분해 주세요. 첫째 줄은 브랜드명, 둘째 줄은 혜택 내용, 셋째 줄 이하는 설명이 됩니다.
            </div>
            <Textarea
              id="rawText"
              rows={8}
              placeholder="예시 입력:&#10;뚜레쥬르&#10;1,000원당 100원 할인&#10;전체 고객 등급 대상 혜택입니다.&#10;&#10;GS25&#10;1,000원당 50원 할인&#10;우수 회원 이상 혜택 제공."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setRawText("")}>
              초기화
            </Button>
            <Button type="button" onClick={handleParse}>
              분석 및 파싱하기
            </Button>
          </div>
        </CardContent>
      </Card>

      {parsedBenefits.length > 0 && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">파싱 완료 / 프리뷰 및 에디터</CardTitle>
                <CardDescription>
                  DB에 적재하기 전, 추출된 정보를 최종 확인하고 필요에 따라 수정하세요.
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary font-bold">
                총 {parsedBenefits.length}개 항목
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">혜택 타이틀 (브랜드 포함)</TableHead>
                    <TableHead className="w-[150px]">혜택 요약</TableHead>
                    <TableHead className="w-[130px]">카테고리</TableHead>
                    <TableHead className="w-[120px]">종료일자</TableHead>
                    <TableHead>상세 설명 (조건/유의사항)</TableHead>
                    <TableHead className="w-[60px] text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedBenefits.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="align-top">
                        <Input
                          value={item.title}
                          onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <Input
                          value={item.summary}
                          onChange={(e) => handleFieldChange(index, "summary", e.target.value)}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <select
                          value={item.category}
                          onChange={(e) => handleFieldChange(index, "category", e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="align-top">
                        <Input
                          type="date"
                          value={item.endsAt || ""}
                          onChange={(e) => handleFieldChange(index, "endsAt", e.target.value)}
                          className="h-9 text-xs"
                        />
                      </TableCell>
                      <TableCell className="align-top">
                        <Textarea
                          value={item.description}
                          onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                          rows={2}
                          className="text-xs resize-y"
                        />
                      </TableCell>
                      <TableCell className="text-center align-top">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRow(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          제외
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setParsedBenefits([])}>
                취소
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting} className="font-semibold">
                {isSubmitting ? "DB 저장 중..." : "최종 DB 일괄 적재"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
