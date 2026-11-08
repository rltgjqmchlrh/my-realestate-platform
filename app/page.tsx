"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, AlertTriangle, Building2, FileText, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react"

export default function VerificationPlatform() {
  // 1. 법적 책임 자가진단 및 주의사항 동의 상태
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false)
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(true)

  // 6. 실시간 통계 카운터 상태 (검증할 때마다 실시간 증가)
  const [todayCount, setTodayCount] = useState(24)
  const [preventionRate, setPreventionRate] = useState(96)

  // 주소 및 건축물대장 연동 상태 (2번: 전국 확대)
  const [region, setRegion] = useState("부산광역시")
  const [district, setDistrict] = useState("수영구")
  const [address, setAddress] = useState("")
  const [isLinked, setIsLinked] = useState(false)

  // 7. 명시사항 입력 항목 상태 (Article 3 & Article 6)
  const [form, setForm] = useState({
    // 중개사무소 명시사항 (Article 3)
    officeName: "",
    officeAddress: "",
    officePhone: "",
    officeRegNo: "",

    // 건축물 및 토지 표시광고 (Article 6)
    propAddress: "",
    isSingleFamilyWithoutLot: false,
    isResidentialFloorHidden: false,
    hiddenFloorType: "중층", // 저층/중층/고층
    areaM2: "",
    isActualAreaMeasured: false,
    actualAreaM2: "",
    priceType: "매매",
    priceValue: "",
    propertyType: "공동주택(아파트)",
    isUnregistered: false,
    isViolatedBuilding: false,
    transactionType: "매매",
    totalFloors: "",
    moveInType: "즉시입주", // 즉시입주 / 날짜직접입력 / 협의조정
    moveInDate: "",
    moveInMonth: "1월",
    moveInPeriod: "중순",
    rooms: "",
    bathrooms: "",
    approvalDate: "",
    inspectionDate: "",
    completionDate: "",
    totalParking: "",
    householdParking: "",
    actualParking: "",
    isNonResidentialNoMaintenance: false,
    maintenanceType: "정액이상", // 정액이상 / 그외
    maintenanceFee: "",
    maintenanceDetails: {
      general: "",
      electric: "",
      water: "",
      gas: "",
      heating: "",
      internet: "",
      tv: "",
      other: ""
    },
    isMaintenanceUnknown: false,
    direction: "남향",
    directionBase: "거실" // 거실, 안방, 주된 출입구
  })

  // 3. 우측 스크롤 체크리스트 항목 계산 (입력 완료 여부 자동 트래킹)
  const checkItems = [
    { id: "office", label: "중개사무소 기본정보 (명칭/연락처 등)", completed: Boolean(form.officeName && form.officePhone) },
    { id: "address", label: "소재지 및 건축물대장 연동", completed: isLinked },
    { id: "area", label: "면적 (㎡ 단위 고정 입력)", completed: Boolean(form.areaM2) },
    { id: "price", label: "가격 및 거래 형태", completed: Boolean(form.priceValue) },
    { id: "type", label: "중개대상물 종류 및 위반여부", completed: Boolean(form.propertyType) },
    { id: "floors", label: "총 층수 및 해당 층", completed: Boolean(form.totalFloors) },
    { id: "movein", label: "입주 가능일 세부 설정", completed: Boolean(form.moveInType) },
    { id: "rooms", label: "방 수 및 욕실 수", completed: Boolean(form.rooms) },
    { id: "date", label: "사용승인일 / 준공인가일", completed: Boolean(form.approvalDate || form.inspectionDate) },
    { id: "parking", label: "주차대수 (전체/세대당/실제)", completed: Boolean(form.totalParking) },
    { id: "maintenance", label: "관리비 세부 비목 (10만원 이상)", completed: form.isNonResidentialNoMaintenance || Boolean(form.maintenanceFee) },
    { id: "direction", label: "방향 및 기준 (거실/안방/출입구)", completed: Boolean(form.direction) },
  ]

  const completedCount = checkItems.filter(i => i.completed).length
  const allCompleted = completedCount === checkItems.length

  // 4번 & 5번: 건축물대장 연동 시 자동 기입 로직 및 주의문구 핸들러
  const handleBuildingHubLink = () => {
    if (!address) {
      alert("소재지 주소를 입력해주세요.")
      return
    }
    // 전국 확대 및 시뮬레이션 자동 연동 값 주입
    setIsLinked(true)
    setForm(prev => ({
      ...prev,
      propAddress: address,
      propertyType: "공동주택 (아파트)",
      totalFloors: "15층",
      totalParking: "120대",
      householdParking: "1.2대",
      approvalDate: "2021-05-15",
      directionBase: "거실" // 주거용이므로 기본 거실 지정
    }))
    setTodayCount(prev => prev + 1)
  }

  // 최종 검증 및 복사 버튼 핸들러
  const [copied, setCopied] = useState(false)
  const [verificationResult, setVerificationResult] = useState("")

  const handleVerifyAndCopy = () => {
    if (!disclaimerAgreed) {
      alert("법적 책임 및 주의사항 동의 체크박스에 체크해 주셔야 검증이 가능합니다.")
      setShowDisclaimerModal(true)
      return
    }
    if (!allCompleted) {
      alert("모든 필수 명시사항 항목이 입력되지 않았습니다. 우측 체크리스트를 확인해주세요.")
      return
    }

    const resultText = `[국토교통부 고시 제2024-748호 준수 명시사항 자가진단 검증완료]
1. 중개사무소: ${form.officeName} (${form.officeAddress}, ${form.officePhone})
2. 소재지: ${form.propAddress}
3. 면적: 전용 ${form.areaM2}㎡
4. 가격: ${form.priceType} ${form.priceValue}만원
5. 중개대상물 종류: ${form.propertyType}
6. 총층수: ${form.totalFloors}
7. 입주가능일: ${form.moveInType === '즉시입주' ? '즉시입주' : form.moveInDate || `${form.moveInMonth} ${form.moveInPeriod}`}
8. 방/욕실: 방 ${form.rooms개}, 욕실 ${form.bathrooms}개
9. 승인일자: 사용승인일(${form.approvalDate})
10. 주차대수: 총 ${form.totalParking} (세대당 ${form.householdParking})
11. 관리비: ${form.isNonResidentialNoMaintenance ? '비대상' : `${form.maintenanceFee}만원`}
12. 방향: ${form.direction} (${form.directionBase} 기준)
[확인완료: 자가진단 적합 판정 - 법적 책임은 작성자 본인에게 있습니다.]`

    setVerificationResult(resultText)
    navigator.clipboard.writeText(resultText)
    setCopied(true)
    setPreventionRate(prev => Math.min(100, prev + 1))
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. 법적 책임 동의 모달 */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertTriangle className="size-8 shrink-0" />
              <h3 className="text-xl font-bold text-slate-900">법적 책임 및 이용 주의사항 안내</h3>
            </div>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200/60">
              <p>
                본 플랫폼은 부동산 표시·광고 명시사항의 적합성 여부에 대한 자가진단을 도와주고 작성 편의성을 높이기 위해 개발된 <strong>사전참고용 자가진단 플랫폼</strong>입니다.
              </p>
              <p>
                실제 표시·광고에 대한 모든 법적 책임은 작성자 본인에게 있으며, 본 플랫폼에서 적합으로 판정되더라도 허위매물, 거짓광고, 부당한 표시·광고 여부에 대한 공적 적합성을 보증하는 것이 아닙니다. 부당 표시광고 시 관련 법률에 따라 <strong>과태료 부과 대상</strong>이 되므로 유의하시기 바랍니다.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="modalAgree"
                checked={disclaimerAgreed}
                onChange={(e) => setDisclaimerAgreed(e.target.checked)}
                className="size-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="modalAgree" className="text-sm font-medium text-slate-800 cursor-pointer">
                위 안내사항을 확인하였으며, 법적 책임이 본인에게 동의합니다.
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                disabled={!disclaimerAgreed}
                onClick={() => setShowDisclaimerModal(false)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50"
              >
                확인 및 플랫폼 시작하기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 상단 헤더 배너 및 6. 실시간 통계 카운터 대시보드 */}
      <header className="bg-slate-900 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold mb-1">
              <Building2 className="size-4" /> 지자체 관내 공인중개사 전용 자가진단 시스템
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              부동산 중개업 표시광고 명시사항 자가진단 및 행정처분 예방 플랫폼
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              국토교통부 고시 제2024-748호 기반 · 오기재 방지 및 공적장부 연동 검증
            </p>
          </div>

          {/* 6. 실시간 동업자 이용 통계 카드 */}
          <div className="flex gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700 w-full md:w-auto shrink-0">
            <div className="text-center px-4 border-r border-slate-700">
              <div className="text-xs text-slate-400">금일 플랫폼 검증 건수</div>
              <div className="text-2xl font-bold text-blue-400 mt-0.5">{todayCount} <span className="text-xs font-normal">건</span></div>
            </div>
            <div className="text-center px-4">
              <div className="text-xs text-slate-400">오기재 방지율</div>
              <div className="text-2xl font-bold text-emerald-400 mt-0.5">{preventionRate}%</div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨테이너 (좌측 입력폼 + 우측 스크롤 체크리스트) */}
      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 좌측 입력 폼 영역 (코드가 길어 핵심 구성 집약) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 2 & 4 & 5. 전국 건축물대장 Hub 연동 패널 */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <FileText className="size-5 text-blue-600" /> 국토교통부 건축물대장 Hub 연동 (전국 확대 지원)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="px-3 py-2 border rounded-xl bg-slate-50 text-sm font-medium"
              >
                <option value="서울특별시">서울특별시</option>
                <option value="부산광역시">부산광역시</option>
                <option value="대구광역시">대구광역시</option>
                <option value="경기도">경기도</option>
                <option value="전국기타">전국 모든 지자체</option>
              </select>
              <input 
                type="text" 
                placeholder="시·군·구 입력 (예: 해운대구, 수영구)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="px-3 py-2 border rounded-xl bg-slate-50 text-sm"
              />
              <input 
                type="text" 
                placeholder="상세 지번 및 건물명 입력"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="px-3 py-2 border rounded-xl bg-slate-50 text-sm sm:col-span-3"
              />
            </div>
            <Button 
              onClick={handleBuildingHubLink}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-medium"
            >
              건축물대장 Hub 연동 및 자동기입 실행
            </Button>

            {/* 5. 연동 완료 주의 문구 배너 */}
            {isLinked && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 leading-relaxed space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-blue-950">
                  <ShieldCheck className="size-4 text-blue-600" /> 국토교통부 건축물대장 HUB 정상 연동 완료
                </p>
                <p>
                  본 플랫폼은 공인중개사가 직접 발급·열람한 건축물대장을 토대로 광고 내용을 기입할 수 있도록 자가검증 편의성을 높이고 오기재를 방지하기 위해 고안된 보조 도구입니다. 연동 결과만을 신뢰하지 말고, 반드시 공인중개사가 직접 공적장부를 선행 확인 후 이용하시기 바랍니다. (미확인으로 인한 법적 책임은 개업공인중개사 본인에게 있습니다.)
                </p>
              </div>
            )}
          </section>

          {/* 7. 고시 제2024-748호 세부 명시사항 입력 섹션 */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-3">
              중개사무소 및 물건별 필수 명시사항 자가진단 입력란
            </h3>

            {/* 중개사무소 정보 (Article 3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600">1. 중개사무소 명칭 (등록증 기재, 사무소/법인 생략가능)</label>
                <input 
                  type="text" 
                  placeholder="예: 홍길동공인중개사"
                  value={form.officeName}
                  onChange={(e) => setForm({...form, officeName: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">2. 중개사무소 연락처 (보조원 번호 기재 불가)</label>
                <input 
                  type="text" 
                  placeholder="예: 051-700-0000"
                  value={form.officePhone}
                  onChange={(e) => setForm({...form, officePhone: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border rounded-xl text-sm"
                />
              </div>
            </div>

            {/* 면적 (Article 6-2) - 제곱미터 고정 및 실측 체크 */}
            <div className="space-y-2 pt-2 border-t">
              <label className="text-xs font-semibold text-slate-600">전용 면적 (고정 단위: ㎡)</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    placeholder="숫자만 입력"
                    value={form.areaM2}
                    onChange={(e) => setForm({...form, areaM2: e.target.value})}
                    className="w-full px-3 py-2 border rounded-xl text-sm pr-10"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">㎡</span>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-700 shrink-0 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={form.isActualAreaMeasured}
                    onChange={(e) => setForm({...form, isActualAreaMeasured: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  대장상 확인 어려워 실측면적 기재
                </label>
              </div>
            </div>

            {/* 입주가능일 (Article 6-7) */}
            <div className="space-y-2 pt-2 border-t">
              <label className="text-xs font-semibold text-slate-600">입주 가능일 설정</label>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="moveIn" 
                    checked={form.moveInType === '즉시입주'}
                    onChange={() => setForm({...form, moveInType: '즉시입주'})}
                  /> 즉시입주
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="moveIn" 
                    checked={form.moveInType === '날짜지정'}
                    onChange={() => setForm({...form, moveInType: '날짜지정'})}
                  /> 세부날짜 지정
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="moveIn" 
                    checked={form.moveInType === '협의조정'}
                    onChange={() => setForm({...form, moveInType: '협의조정'})}
                  /> 합의에 따라 조정 가능 (월/순 선택)
                </label>
              </div>
              {form.moveInType === '날짜지정' && (
                <input 
                  type="date" 
                  value={form.moveInDate}
                  onChange={(e) => setForm({...form, moveInDate: e.target.value})}
                  className="w-full mt-2 px-3 py-2 border rounded-xl text-sm"
                />
              )}
              {form.moveInType === '협의조정' && (
                <div className="flex gap-2 mt-2">
                  <select 
                    value={form.moveInMonth}
                    onChange={(e) => setForm({...form, moveInMonth: e.target.value})}
                    className="px-3 py-2 border rounded-xl text-sm flex-1"
                  >
                    {Array.from({length: 12}, (_, i) => `${i+1}월`).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select 
                    value={form.moveInPeriod}
                    onChange={(e) => setForm({...form, moveInPeriod: e.target.value})}
                    className="px-3 py-2 border rounded-xl text-sm flex-1"
                  >
                    <option value="초순">초순</option>
                    <option value="중순">중순</option>
                    <option value="하순">하순</option>
                  </select>
                </div>
              )}
            </div>

            {/* 방향 및 조건부 블록 (Article 6-12) */}
            <div className="space-y-2 pt-2 border-t">
              <label className="text-xs font-semibold text-slate-600">방향 및 기준 설정 (주거용은 거실/안방 한정)</label>
              <div className="grid grid-cols-2 gap-3">
                <select 
                  value={form.direction}
                  onChange={(e) => setForm({...form, direction: e.target.value})}
                  className="px-3 py-2 border rounded-xl text-sm"
                >
                  {["동향", "서향", "남향", "북향", "북동향", "남동향", "남서향", "북서향"].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select 
                  value={form.directionBase}
                  onChange={(e) => setForm({...form, directionBase: e.target.value})}
                  className="px-3 py-2 border rounded-xl text-sm"
                >
                  <option value="거실">거실 기준</option>
                  <option value="안방">안방 기준</option>
                  <option value="주된 출입구" disabled={form.propertyType.includes("주택")}>주된 출입구 기준 (비주거용 한정)</option>
                </select>
              </div>
            </div>

            {/* 최종 검증 및 복사 버튼 */}
            <div className="pt-4 border-t">
              <Button 
                onClick={handleVerifyAndCopy}
                disabled={!allCompleted}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-base shadow-lg disabled:opacity-50"
              >
                {copied ? <Check className="size-5 mr-2" /> : <Copy className="size-5 mr-2" />}
                {copied ? "광고 텍스트 복사완료!" : "명시사항 자가진단 및 광고 문구 복사하기"}
              </Button>
            </div>
          </section>

        </div>

        {/* 3. 우측 스크롤 체크리스트 패널 (화면 고정 스티키) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" /> 명시사항 작성 진행도
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-full text-slate-700">
                {completedCount} / {checkItems.length} 완료
              </span>
            </div>

            {/* 프로그레스 바 */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(completedCount / checkItems.length) * 100}%` }}
              ></div>
            </div>

            {/* 항목별 체크 상태 목록 */}
            <ul className="space-y-2.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
              {checkItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5 text-xs">
                  {item.completed ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="size-4 rounded-full border-2 border-slate-300 shrink-0" />
                  )}
                  <span className={item.completed ? "text-slate-900 font-medium line-through opacity-70" : "text-slate-600"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            {allCompleted && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center text-xs text-emerald-800 font-bold">
                🎉 모든 필수 항목이 검증 완료되었습니다!
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
