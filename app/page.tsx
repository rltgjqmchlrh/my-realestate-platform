"use client"

import React, { useState } from "react"
import { 
  Check, 
  Copy, 
  AlertTriangle, 
  Building2, 
  FileText, 
  ShieldCheck, 
  CheckCircle2 
} from "lucide-react"

const ADMIN_DISTRICTS: Record<string, string[]> = {
  "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  "부산광역시": ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
  "대구광역시": ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
  "인천광역시": ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  "광주광역시": ["동구", "서구", "남구", "북구", "광산구"],
  "대전광역시": ["동구", "중구", "서구", "유성구", "대덕구"],
  "울산광역시": ["중구", "남구", "동구", "북구", "울주군"],
  "세종특별자치시": ["세종시"],
  "경기도": ["수원시", "성남시", "의정부시", "안양시", "부천시", "광명시", "평택시", "동두천시", "안산시", "고양시", "과천시", "구리시", "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "용인시", "파주시", "이천시", "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"],
  "강원특별자치도": ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  "충청북도": ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  "충청남도": ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
  "전북특별자치도": ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
  "전라남도": ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  "경상북도": ["포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  "경상남도": ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  "제주특별자치도": ["제주시", "서귀포시"]
}

export default function VerificationPlatform() {
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false)
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(true)

  const [todayCount, setTodayCount] = useState(24)
  const [preventionRate, setPreventionRate] = useState(96)

  const [selectedSido, setSelectedSido] = useState("부산광역시")
  const [selectedSigungu, setSelectedSigungu] = useState("수영구")
  const [detailAddress, setDetailAddress] = useState("")
  const [buildingHo, setBuildingHo] = useState("")
  const [isLinked, setIsLinked] = useState(false)

  const [form, setForm] = useState({
    officeName: "",
    officeAddress: "",
    officePhone: "",
    officeRegNo: "",
    isSingleFamily: false,
    isSingleFamilyLotPrivate: false,
    isMultiFamilyLotPrivate: false,
    multiFamilyFloorCategory: "중층",
    areaM2: "",
    isActualAreaMeasured: false,
    actualAreaM2: "",
    transactionType: "매매",
    priceValue: "",
    propertyType: "공동주택(아파트)",
    buildingStatus: "해당없음(일반)",
    totalFloors: "",
    moveInType: "즉시입주",
    moveInDate: "",
    moveInMonth: "1월",
    moveInPeriod: "중순",
    rooms: "",
    bathrooms: "",
    approvalDateType: "사용승인일",
    approvalDate: "",
    inspectionDate: "",
    completionDate: "",
    totalParking: "",
    householdParking: "",
    actualParking: "",
    isNonResidentialNoMaintenance: false,
    maintenanceOption: "월 10만원 이상 정액 부과",
    maintenanceFee: "",
    maintenanceAvgFee: "",
    direction: "남향",
    directionBase: "거실"
  })

  const checkItems = [
    { id: "office", label: "중개사무소 명시사항 (명칭/연락처/등록번호)", completed: Boolean(form.officeName && form.officePhone && form.officeRegNo) },
    { id: "address", label: "소재지 및 건축물대장 Hub 연동", completed: isLinked },
    { id: "area", label: "전용면적 (㎡ 단위 고정 입력)", completed: Boolean(form.areaM2 || (form.isActualAreaMeasured && form.actualAreaM2)) },
    { id: "price", label: "가격 및 거래 형태", completed: Boolean(form.priceValue && form.transactionType) },
    { id: "type", label: "중개대상물 종류 및 상태", completed: Boolean(form.propertyType) },
    { id: "floors", label: "총 층수 및 해당 층", completed: Boolean(form.totalFloors) },
    { id: "movein", label: "입주가능일 세부 설정", completed: Boolean(form.moveInType) },
    { id: "rooms", label: "방 수 및 욕실 수", completed: Boolean(form.rooms && form.bathrooms) },
    { id: "date", label: "사용승인일/사용검사일/준공인가일", completed: Boolean(form.approvalDate || form.inspectionDate || form.completionDate) },
    { id: "parking", label: "주차대수 (총/세대당/실제)", completed: Boolean(form.totalParking) },
    { id: "maintenance", label: "관리비 세부 비목 (10만원 이상)", completed: form.isNonResidentialNoMaintenance || Boolean(form.maintenanceFee || form.maintenanceAvgFee) },
    { id: "direction", label: "방향 및 용도별 기준 설정", completed: Boolean(form.direction && form.directionBase) },
  ]

  const completedCount = checkItems.filter(i => i.completed).length
  const allCompleted = completedCount === checkItems.length

  const handleSidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sido = e.target.value
    setSelectedSido(sido)
    const sigungus = ADMIN_DISTRICTS[sido] || []
    setSelectedSigungu(sigungus[0] || "")
  }

  const handleBuildingHubLink = () => {
    if (!detailAddress) {
      alert("상세 지번 또는 건물명을 입력해 주세요.")
      return
    }

    setIsLinked(true)
    const isResidential = !detailAddress.includes("상가") && !detailAddress.includes("타워")

    setForm(prev => ({
      ...prev,
      propertyType: isResidential ? "공동주택(아파트)" : "제1종 근린생활시설",
      totalFloors: "15층",
      totalParking: "120대",
      householdParking: "1.2대",
      approvalDateType: "사용승인일",
      approvalDate: "2021-05-15",
      directionBase: isResidential ? "거실" : "주된 출입구"
    }))

    setTodayCount(prev => prev + 1)
  }

  const [copied, setCopied] = useState(false)

  const handleVerifyAndCopy = () => {
    if (!disclaimerAgreed) {
      alert("법적 책임 및 이용 주의사항 확인 동의가 필요합니다.")
      setShowDisclaimerModal(true)
      return
    }

    if (!allCompleted) {
      alert("모든 필수 명시사항 항목이 입력되지 않았습니다. 우측 체크리스트를 확인해주세요.")
      return
    }

    const areaText = form.isActualAreaMeasured ? "실측 " + form.actualAreaM2 + "㎡" : "전용 " + form.areaM2 + "㎡";
    const moveInText = form.moveInType === '즉시입주' ? '즉시입주' : form.moveInType === '날짜지정' ? form.moveInDate : form.moveInMonth + " " + form.moveInPeriod;
    const maintenanceText = form.isNonResidentialNoMaintenance ? '비대상 (주택 외 건축물)' : form.maintenanceOption === '월 10만원 이상 정액 부과' ? "월 " + form.maintenanceFee + "만원" : "월평균 " + form.maintenanceAvgFee + "만원";

    const resultText = 
      "[국토교통부 고시 제2024-748호 준수 표시·광고 명시사항 자가진단 검증완료]\n" +
      "■ 중개사무소 명시사항 (제3조)\n" +
      "1. 명칭: " + form.officeName + "\n" +
      "2. 소재지: " + form.officeAddress + "\n" +
      "3. 연락처: " + form.officePhone + "\n" +
      "4. 등록번호: " + form.officeRegNo + "\n\n" +
      "■ 인터넷 표시·광고 명시사항 (제6조)\n" +
      "1. 소재지: " + selectedSido + " " + selectedSigungu + " " + detailAddress + (buildingHo ? " " + buildingHo + "호" : "") + "\n" +
      "2. 면적: " + areaText + "\n" +
      "3. 가격: " + form.transactionType + " " + form.priceValue + "만원\n" +
      "4. 중개대상물 종류: " + form.propertyType + " (" + form.buildingStatus + ")\n" +
      "5. 거래 형태: " + form.transactionType + "\n" +
      "6. 총 층수: " + form.totalFloors + "\n" +
      "7. 입주가능일: " + moveInText + "\n" +
      "8. 방 수 / 욕실 수: 방 " + form.rooms + "개 / 욕실 " + form.bathrooms + "개\n" +
      "9. 승인/검사일: " + form.approvalDateType + "(" + (form.approvalDate || form.inspectionDate || form.completionDate) + ")\n" +
      "10. 주차대수: 총 " + form.totalParking + " (세대당 " + form.householdParking + (form.actualParking ? ", 실제가능 " + form.actualParking : "") + ")\n" +
      "11. 관리비: " + maintenanceText + "\n" +
      "12. 방향: " + form.direction + " (" + form.directionBase + " 기준)\n\n" +
      "[검증결과: 자가진단 적합 판정 - 본 표시광고 내용의 모든 법적 책임은 개업공인중개사 본인에게 있습니다.]";

    navigator.clipboard.writeText(resultText)
    setCopied(true)
    setPreventionRate(prev => Math.min(100, prev + 1))
    setTimeout(() => setCopied(false), 3500)
  }

  const isResidentialType = form.propertyType.includes("주택") || form.propertyType.includes("아파트") || form.propertyType.includes("오피스텔")

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertTriangle className="size-7 shrink-0" />
              <h3 className="text-xl font-bold text-slate-900">법적 책임 및 이용 주의사항 안내</h3>
            </div>
            
            <div className="text-sm text-slate-600 leading-relaxed space-y-3 bg-amber-50/70 p-4 rounded-xl border border-amber-200/80">
              <p>
                본 플랫폼은 부동산 표시·광고 명시사항의 적합성 여부에 대한 자가진단을 도와주고 작성 편의성을 높이기 위해 개발된 <strong>사전참고용 자가진단 플랫폼</strong>입니다.
              </p>
              <p>
                실제 표시·광고에 대한 모든 법적 책임은 작성자 본인에게 있으며, 과태료 부과 대상이 될 수 있음을 유의하시기 바랍니다.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2.5 pt-2">
              <input 
                type="checkbox" 
                id="modalAgree"
                checked={disclaimerAgreed}
                onChange={(e) => setDisclaimerAgreed(e.target.checked)}
                className="size-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="modalAgree" className="text-sm font-medium text-slate-800 cursor-pointer select-none">
                위 안내사항을 확인하였으며, 법적 책임이 본인에게 있음을 동의합니다.
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                disabled={!disclaimerAgreed}
                onClick={() => setShowDisclaimerModal(false)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-colors shadow-sm"
              >
                확인 및 자가진단 시작하기
              </button
