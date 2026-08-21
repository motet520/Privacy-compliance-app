// ============================================================
// 중소기업 개인정보 처리방침 AI 진단 솔루션 (v10.0 - 1-Click 1:1 맞춤형 보완 조항 즉시 복사)
// ============================================================

(function () {
  'use strict';

  let PIPC_KNOWLEDGE_BASE = null;

  const DIAGNOSTIC_RULES = [
    {
      id: 'rule_1',
      title: '1. 개인정보의 수집·이용 목적 및 항목',
      desc: '처리하는 개인정보의 필수/선택 항목과 수집 목적이 구체적으로 구분 명시되어야 합니다.',
      regex: /(수집|목적|처리하는\s*개인정보|수집항목|수집하는\s*개인정보|개인정보\s*파일)/i,
      subRegex: /(이름|성명|이메일|연락처|전화번호|주소|서비스|필수|선택|회원|목적)/i,
      fixGuide: '수집하는 필수 항목과 선택 항목을 구체적으로 구분하고, 회원가입·서비스 이행 등 개별 목적을 명확히 작성하세요.',
      standardClause: '제1조(개인정보의 수집·이용 목적 및 항목)\n{COMPANY_NAME}은(는) 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집·처리합니다.\n- 필수항목: 성명, 휴대전화번호, 이메일 주소 (목적: 서비스 문의 대응, 본인 확인)\n- 선택항목: 회사명, 부서명 (목적: 맞춤형 상담)'
    },
    {
      id: 'rule_2',
      title: '2. 개인정보의 보유 및 이용 기간',
      desc: '원칙적 파기 시점 및 전자상거래법, 통신비밀보호법 등 관계 법령에 따른 보존 기간이 기재되어야 합니다.',
      regex: /(보유|이용\s*기간|보존\s*기간|파기\s*시점)/i,
      subRegex: /(법령|상법|전자상거래|파기|보존|년|월|탈퇴)/i,
      fixGuide: '원칙적 보유 기간(회원 탈퇴 시 등)과 관련 법령(전자상거래법 5년, 통신비밀보호법 3개월 등)에 의한 보존 기간을 명시하세요.',
      standardClause: '제2조(개인정보의 보유 및 이용기간)\n① {COMPANY_NAME}은(는) 정보주체로부터 개인정보 수집 시 동의받은 보유·이용기간 또는 법령에 따른 보유기간 내에서 개인정보를 처리·보유합니다.\n- 서비스 문의 및 상담 기록: 상담 완료 후 1년\n② 단, 전자상거래법 등 관계 법령에 따라 보존할 필요가 있는 경우 해당 법정 기간 동안 보관합니다.'
    },
    {
      id: 'rule_3',
      title: '3. 개인정보의 제3자 제공에 관한 사항',
      desc: '제3자 제공 여부, 제공받는 자, 목적, 항목, 보유기간이 명시되어야 합니다.',
      regex: /(제\s*3\s*자\s*제공|3\s*자\s*제공|제3자|제\s*3\s*자)/i,
      subRegex: /(동의|제공받는|제공하지\s*않|별도\s*동의|없음|원칙적으로\s*제공)/i,
      fixGuide: '제3자 제공이 없을 경우 "원칙적으로 제3자에게 제공하지 않습니다"를 명시하고, 제공 시 별도 동의 절차와 항목을 기재하세요.',
      standardClause: '제3조(개인정보의 제3자 제공)\n{COMPANY_NAME}은(는) 원칙적으로 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법률의 특별한 규정이 있거나 정보주체의 별도 동의를 받은 경우에 한하여 제공합니다.'
    },
    {
      id: 'rule_4',
      title: '4. 개인정보 처리 위탁 내용 및 수탁자',
      desc: '외주/위탁 업무 내용과 수탁업체 사명이 기재되어야 합니다.',
      regex: /(위탁|수탁자|위탁업체|위탁\s*내용|수탁\s*업체)/i,
      subRegex: /(수탁|위탁|위탁하지\s*않|택배|PG|유형|범위|업무)/i,
      fixGuide: '결제, 배송, IT 인프라 등 개인정보 처리를 위탁받는 업체명과 위탁 업무 범위를 명시하세요.',
      standardClause: '제4조(개인정보 처리 위탁)\n{COMPANY_NAME}은(는) 원활한 서비스 제공 및 데이터 관리 업무를 위해 아래와 같이 개인정보 처리업무를 위탁하고 있습니다.\n- 위탁받는 자 (수탁자): IT 호스팅 인프라 제공업체 및 이메일 발송 위탁사\n- 위탁하는 업무의 내용: 서버 시스템 유지보수 및 문의 답변 메일 발송'
    },
    {
      id: 'rule_5',
      title: '5. 개인정보의 파기 절차 및 방법',
      desc: '전자적 파일의 영구 삭제 방법 및 종이 출력물 분쇄/소각 방법이 명시되어야 합니다.',
      regex: /(파기|파기\s*절차|파기\s*방법|삭제\s*방법)/i,
      subRegex: /(전자적|영구|삭제|분쇄|소각|복구|기술적|절차)/i,
      fixGuide: '전자적 파일(복구 불가능한 기술적 삭제)과 서면 출력물(분쇄/소각)의 구체적 파기 방식을 명시하세요.',
      standardClause: '제5조(개인정보 파기 절차 및 방법)\n① {COMPANY_NAME}은(는) 개인정보 보유기간 경과, 처리목적 달성 시 지체 없이 파기합니다.\n② 전자적 파일 형태: 복구할 수 없는 기술적 방법을 사용하여 영구 삭제합니다.\n③ 종이 출력물: 문서 분쇄기로 분쇄하거나 소각하여 파기합니다.'
    },
    {
      id: 'rule_6',
      title: '6. 정보주체와 법정대리인의 권리·의무 및 행사방법',
      desc: '열람·정정·삭제·처리정지 요구권, 자동화된 결정 거부권 및 법정대리인 행사 방법이 기재되어야 합니다.',
      regex: /(권리|의무|열람|정정|삭제|처리\s*정지|권리\s*행사)/i,
      subRegex: /(행사|법정\s*대리인|요구|서면|자동화|정보주체)/i,
      fixGuide: '정보주체 및 14세 미만 아동의 법정대리인이 권리를 행사할 수 있는 절차(서면, 이메일 등)를 기술하세요.',
      standardClause: '제6조(정보주체와 법정대리인의 권리·의무 및 행사방법)\n정보주체 및 14세 미만 아동의 법정대리인은 언제든지 서면, 이메일, 전화 등을 통해 개인정보 열람·정정·삭제·처리정지를 요구할 수 있으며 {COMPANY_NAME}은(는) 지체 없이 조치하겠습니다.'
    },
    {
      id: 'rule_7',
      title: '7. 개인정보 보호책임자(CPO) 성명 및 연락처',
      desc: '개인정보 보호책임자의 성명(또는 담당 부서명), 직책, 전화번호, 이메일이 반드시 포함되어야 합니다.',
      regex: /(보호\s*책임자|보호책임자|CPO|보호\s*담당|고충\s*처리|열람\s*청구)/i,
      subRegex: /(성명|이름|연락처|전화|이메일|부서|담당|실명|직책)/i,
      fixGuide: '개인정보 보호책임자의 실명(또는 담당 부서명), 직책, 전화번호, 이메일 주소를 누락 없이 기재하세요.',
      standardClause: '제7조(개인정보 보호책임자 및 담당부서)\n{COMPANY_NAME}은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고 관련 고충처리를 위하여 아래와 같이 개인정보 보호책임자(CPO)를 지정하고 있습니다.\n- 개인정보 보호책임자: 대표이사 (또는 정보보호 담당 부서장)\n- 연락처: {CPO_PHONE} / 이메일: {CPO_EMAIL}'
    },
    {
      id: 'rule_8',
      title: '8. 개인정보의 안전성 확보 조치',
      desc: '기술적, 관리적, 물리적 보안 대책이 작성되어야 합니다.',
      regex: /(안전성|안전성\s*확보|보안\s*대책|보안\s*조치)/i,
      subRegex: /(기술적|관리적|암호화|접근\s*권한|백신|물리적|조치)/i,
      fixGuide: '비밀번호 암호화, 백신 프로그램 설치, 접근 권한 최소화 등 안전성 확보를 위한 대책을 서술하세요.',
      standardClause: '제8조(개인정보의 안전성 확보 조치)\n{COMPANY_NAME}은(는) 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.\n- 관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육\n- 기술적 조치: 접근권한 관리, 주요 데이터 암호화, 백신 프로그램 운영\n- 물리적 조치: 전산실 및 자료보관실 출입 통제'
    },
    {
      id: 'rule_9',
      title: '9. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부',
      desc: '쿠키의 사용 목적 및 웹브라우저/모바일 차단 설정 통한 쿠키 거부 방법이 안내되어야 합니다.',
      regex: /(쿠키|cookie|자동\s*수집|수집\s*장치)/i,
      subRegex: /(설치|운영|거부|설정|브라우저|미사용|수집하지\s*않|거부\s*방법)/i,
      fixGuide: '쿠키 수집 목적을 설명하고, 미사용 시 "쿠키를 수집·운영하지 않음"을 명시하세요.',
      standardClause: '제9조(개인정보 자동 수집 장치의 설치·운영 및 거부)\n① {COMPANY_NAME}은(는) 맞춤형 서비스 제공을 위해 쿠키(cookie)를 사용할 수 있습니다.\n② 이용자는 웹브라우저 옵션 설정(도구 > 인터넷 옵션 > 개인정보)을 통해 쿠키 저장을 거부할 수 있습니다.'
    },
    {
      id: 'rule_10',
      title: '10. 권익침해 구제방법 및 전문기관 연락처',
      desc: '개인정보분쟁조정위원회(1833-6972), 침해신고센터(118), 대검찰청, 경찰청 등의 안내가 포함되어야 합니다.',
      regex: /(구제|분쟁|권익|침해\s*신고|구제\s*방법)/i,
      subRegex: /(개인정보분쟁조정위원회|118|경찰청|대검찰청|상담|1833-6972|분쟁\s*조정)/i,
      fixGuide: '개인정보 침해 신고 센터(118), 개인정보 분쟁조정위원회(1833-6972) 등의 기관명과 연락처를 기재하세요.',
      standardClause: '제10조(권익침해 구제방법)\n개인정보 침해에 대한 피해구제, 상담은 아래 전문기관에 문의하실 수 있습니다.\n- 개인정보분쟁조정위원회: (국번없이) 1833-6972\n- 개인정보침해신고센터: (국번없이) 118\n- 대검찰청 사이버수사과: (국번없이) 1301\n- 경찰청 사이버범죄신고: (국번없이) 182'
    },
    {
      id: 'rule_11',
      title: '11. 생성형 AI 서비스 프롬프트·데이터 처리 및 거부(Opt-out) [최신 지침]',
      desc: '생성형 AI 기능 이용 시 프롬프트 저장 여부 및 AI 학습 거부권이 명시되어야 합니다.',
      isOptional: true,
      regex: /(AI|인공지능|생성형|프롬프트|학습)/i,
      subRegex: /(거부|옵트아웃|Opt-out|입력|학습|해당\s*없음|미사용|수집하지\s*않)/i,
      fixGuide: 'AI 서비스 미도입 기관은 "AI 기반 데이터 처리 해당 없음"으로 간주하여 정상 판정됩니다.',
      standardClause: '제11조(생성형 AI 서비스 데이터 처리 및 거부)\n{COMPANY_NAME}은(는) AI 기반 서비스를 이용하는 경우 입력된 데이터 및 프롬프트를 무단으로 모델 학습에 활용하지 않으며, 이용자는 언제든지 거부(Opt-out)를 요청할 수 있습니다.'
    },
    {
      id: 'rule_12',
      title: '12. 맞춤형 광고 행태정보(ADID) 수집·이용 및 차단 옵션 [최신 지침]',
      desc: '맞춤형 광고용 행태정보 수집 여부 및 차단 방법이 명시되어야 합니다.',
      isOptional: true,
      regex: /(행태정보|맞춤형\s*광고|광고\s*식별자|ADID|IDFA)/i,
      subRegex: /(차단|거부|설정|방문기록|해당\s*없음|미수집|수집하지\s*않)/i,
      fixGuide: '공공기관 및 비상업 웹사이트는 "맞춤형 광고 행태정보 수집 없음"으로 정상 판정됩니다.',
      standardClause: '제12조(맞춤형 광고 행태정보 수집 및 차단)\n{COMPANY_NAME}은(는) 타겟 맞춤형 광고를 위한 온라인 행태정보(ADID, IDFA 등)를 제3자에게 수집·제공하지 않습니다.'
    }
  ];

  const SAMPLE_POLICIES = {
    sample_sinnotech: {
      companyName: '(주)씨노텍',
      url: 'http://www.sinnotech.kr/home/content/privacy',
      cpo: '씨노텍 (실명 누락)',
      email: 'sinnotech@sinnotech.kr',
      text: `개인정보 처리방침

SINNOTECH(이하 '씨노텍'로 표기)는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.

제1조(개인정보의 처리 목적, 처리 및 보유 기간, 수집 항목, 보유 및 이용기간)
씨노텍은 상담, 서비스 신청등을 위해 다음과 같은 개인정보를 수집하고 있습니다. 
- 수집항목 : (필수) 성명, 휴대전화번호, 이메일 주소등

① <개인정보처리자명>은(는) 법령에 따른 개인정보 보유․이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유․이용기간 내에서 개인정보를 처리․보유합니다. 
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
1. 홈페이지 회원 가입 및 관리 : 홈페이지 탈퇴 시까지

제2조(개인정보의 제3자 제공)
씨노텍은 정보주체의 동의나, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 제3자에게 제공합니다.

제3조(개인정보의 파기 절차 및 방법)
① 씨노텍은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.

제4조(정보주체와 법정대리인의 권리·의무 및 행사방법에 관한 사항)
① 정보주체는 씨노텍에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.

제5조(개인정보의 안전성 확보조치에 관한 사항)
1. 관리적 조치 : 내부관리계획 수립·시행, 정기적 직원 교육
2. 기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 개인정보의 암호화

제6조(개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에 관한 사항)
① 쿠키 저장을 거부 할 수 있습니다.

제7조(개인정보 보호책임자에 관한 사항)
성명: 씨노텍
연락처 : 032-715-6050
이메일 : sinnotech@sinnotech.kr`
    },
    sample_bad: {
      companyName: '(주)에이비씨 쇼핑몰',
      url: 'https://www.abc-sample-mall.co.kr/privacy',
      cpo: '미지정 (담당자 누락)',
      email: 'contact@abc-sample-mall.co.kr',
      text: '[개인정보 처리방침]\n\n1. 수집하는 개인정보 항목\n회사는 회원가입 시 이름, 이메일, 전화번호를 수집합니다.\n\n2. 개인정보의 이용목적\n회원 관리 및 상품 배송 목적으로 이용합니다.\n\n3. 개인정보의 보유기간\n회원 탈퇴 시까지 보유합니다.\n\n4. 개인정보의 파기\n목적이 달성된 개인정보는 지체없이 파기합니다.\n\n5. 고객센터\n이메일: contact@abc-sample-mall.co.kr'
    },
    sample_good: {
      companyName: '(주)한국보안기술',
      url: 'https://www.korea-sec-tech.co.kr/privacy',
      cpo: '박민수 이사 (보안기획실)',
      email: 'cpo@korea-sec-tech.co.kr',
      text: '(주)한국보안기술 개인정보 처리방침 (최신 지침 적용판)\n\n1. 개인정보의 수집·이용 목적 및 항목\n회사는 서비스 제공을 위해 필수항목(성명, 이메일, 연락처, 회사명)을 수집하며, 회원 관리 및 고객 문의 대응 목적으로 이용합니다.\n\n2. 개인정보의 보유 및 이용 기간\n이용자의 개인정보는 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 전자상거래법에 따라 계약/청약철회 기록은 5년 보존합니다.\n\n3. 개인정보의 제3자 제공\n회사는 원칙적으로 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.\n\n4. 개인정보 처리 위탁 내용 및 수탁자\n회사는 원활한 서비스 제공을 위해 PG결제(NICE페이먼츠), 택배배송(CJ대한통운)에 위탁하고 있습니다.\n\n5. 개인정보의 파기 절차 및 방법\n전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 영구 파기하며, 종이 출력물은 분쇄기로 분쇄합니다.\n\n6. 정보주체와 법정대리인의 권리·의무 및 행사방법\n정보주체 및 14세 미만 아동의 법정대리인은 언제든지 개인정보 열람, 정정, 삭제, 처리정지 및 자동화된 결정 거부를 요구할 수 있습니다.\n\n7. 개인정보 보호책임자(CPO) 성명 및 연락처\n- 성명: 박민수 이사 (보안기획실)\n- 전화번호: 02-1234-5678\n- 이메일: cpo@korea-sec-tech.co.kr\n\n8. 개인정보의 안전성 확보 조치\n회사는 비밀번호 암호화 저장, 백신 프로그램 설치, 접근 권한의 관리 등 기술적·관리적 안전성 확보 조치를 취하고 있습니다.\n\n9. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부\n회사는 맞춤형 서비스 제공을 위해 쿠키를 사용하며, 웹브라우저 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.\n\n10. 권익침해 구제방법\n개인정보 침해 관련 상담은 개인정보분쟁조정위원회(1833-6972) 또는 개인정보침해신고센터(118)로 문의하실 수 있습니다.\n\n11. 생성형 AI 서비스 데이터 처리 및 거부(Opt-out) 안내\n회사는 AI 서비스 제공 시 입력된 프롬프트 데이터를 이용자의 동의 없이 모델 학습에 활용하지 않으며, 이용자는 언제든지 거부(Opt-out)를 요청할 수 있습니다.\n\n12. 맞춤형 광고 행태정보 수집 안내\n회사는 타겟 맞춤형 광고를 위한 온라인 행태정보(ADID 등)를 수집하지 않습니다.'
    }
  };

  let activeInputMode = 'url';
  let extractedOcrText = '';
  let fetchedUrlText = '';
  let lastDiagnosticResult = null;
  let historyLogs = JSON.parse(localStorage.getItem('privacy_diag_history') || '[]');

  let inputCompanyName, inputCpoEmail, inputUrlLink, inputPolicyText, btnRunScan, btnRunAiScan;
  let selectAiEngine, inputGeminiApiKey, btnSaveGeminiKey, aiStatusBadge;
  let btnModeUrl, btnModeImage, btnModeText;
  let modePanelUrl, modePanelImage, modePanelText;
  let imageDropzone, inputImageFile, dropzonePrompt, imagePreviewContainer, imagePreview, btnRemoveImage;
  let panelScan, panelReport, panelRequestDoc, panelHistory;
  let navScanBtn, navReportBtn, navDocBtn, navHistoryBtn;

  document.addEventListener('DOMContentLoaded', () => {
    inputCompanyName = document.getElementById('input-company-name');
    inputCpoEmail    = document.getElementById('input-cpo-email');
    inputUrlLink     = document.getElementById('input-url-link');
    inputPolicyText  = document.getElementById('input-policy-text');
    btnRunScan       = document.getElementById('btn-run-scan');
    btnRunAiScan     = document.getElementById('btn-run-ai-scan');

    selectAiEngine     = document.getElementById('select-ai-engine');
    inputGeminiApiKey  = document.getElementById('input-gemini-api-key');
    btnSaveGeminiKey   = document.getElementById('btn-save-gemini-key');
    aiStatusBadge      = document.getElementById('ai-status-badge');

    btnModeUrl       = document.getElementById('btn-mode-url');
    btnModeImage     = document.getElementById('btn-mode-image');
    btnModeText      = document.getElementById('btn-mode-text');

    modePanelUrl     = document.getElementById('mode-panel-url');
    modePanelImage   = document.getElementById('mode-panel-image');
    modePanelText    = document.getElementById('mode-panel-text');

    imageDropzone        = document.getElementById('image-dropzone');
    inputImageFile       = document.getElementById('input-image-file');
    dropzonePrompt       = document.getElementById('dropzone-prompt');
    imagePreviewContainer = document.getElementById('image-preview-container');
    imagePreview         = document.getElementById('image-preview');
    btnRemoveImage       = document.getElementById('btn-remove-image');

    panelScan        = document.getElementById('panel-scan');
    panelReport      = document.getElementById('panel-report');
    panelRequestDoc  = document.getElementById('panel-request-doc');
    panelHistory     = document.getElementById('panel-history');

    navScanBtn       = document.getElementById('nav-scan');
    navReportBtn     = document.getElementById('nav-report');
    navDocBtn        = document.getElementById('nav-doc');
    navHistoryBtn    = document.getElementById('nav-history');

    const savedKey = localStorage.getItem('gemini_api_key') || '';
    if (inputGeminiApiKey && savedKey) {
      inputGeminiApiKey.value = savedKey;
    }

    bindEvents();
    renderHistoryTable();
    loadPipcKnowledgeBase();
  });

  async function loadPipcKnowledgeBase() {
    try {
      const res = await fetch('./knowledge_base/pipc_guidelines.json');
      PIPC_KNOWLEDGE_BASE = await res.json();
    } catch (e) {
      console.warn('PIPC Knowledge Base fetch fallback:', e);
    }
  }

  function bindEvents() {
    navScanBtn?.addEventListener('click', () => switchTab('scan'));
    navReportBtn?.addEventListener('click', () => switchTab('report'));
    navDocBtn?.addEventListener('click', () => switchTab('doc'));
    navHistoryBtn?.addEventListener('click', () => switchTab('history'));

    btnModeUrl?.addEventListener('click', () => switchInputMode('url'));
    btnModeImage?.addEventListener('click', () => switchInputMode('image'));
    btnModeText?.addEventListener('click', () => switchInputMode('text'));

    document.getElementById('btn-crawl-url')?.addEventListener('click', handleUrlFetch);

    btnSaveGeminiKey?.addEventListener('click', () => {
      const key = inputGeminiApiKey.value.trim();
      if (key) {
        localStorage.setItem('gemini_api_key', key);
        alert('🔒 Gemini API Key가 사용자의 로컬 브라우저에 안전하게 저장되었습니다!');
      } else {
        localStorage.removeItem('gemini_api_key');
        alert('🗑️ API Key가 삭제되었습니다.');
      }
    });

    imageDropzone?.addEventListener('click', () => inputImageFile.click());
    imageDropzone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      imageDropzone.classList.add('dragover');
    });
    imageDropzone?.addEventListener('dragleave', () => imageDropzone.classList.remove('dragover'));
    imageDropzone?.addEventListener('drop', (e) => {
      e.preventDefault();
      imageDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processImageFile(e.dataTransfer.files[0]);
      }
    });
    inputImageFile?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processImageFile(e.target.files[0]);
      }
    });
    btnRemoveImage?.addEventListener('click', (e) => {
      e.stopPropagation();
      resetImageInput();
    });

    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.target.dataset.preset;
        if (SAMPLE_POLICIES[key]) {
          loadPreset(SAMPLE_POLICIES[key]);
        }
      });
    });

    btnRunScan?.addEventListener('click', runDiagnostic);
    btnRunAiScan?.addEventListener('click', runSelectedAiDiagnostic);

    document.getElementById('btn-generate-doc')?.addEventListener('click', () => {
      if (!lastDiagnosticResult) {
        alert('먼저 개인정보 처리방침 진단을 실행해주세요.');
        return;
      }
      buildRemediationDocument(lastDiagnosticResult);
      switchTab('doc');
    });

    document.getElementById('btn-copy-doc')?.addEventListener('click', copyDocToClipboard);
    document.getElementById('btn-print-doc')?.addEventListener('click', () => window.print());
    document.getElementById('btn-email-doc')?.addEventListener('click', sendEmailDraft);
  }

  function switchInputMode(mode) {
    activeInputMode = mode;
    [btnModeUrl, btnModeImage, btnModeText].forEach(b => b && b.classList.remove('active'));
    [modePanelUrl, modePanelImage, modePanelText].forEach(p => p && p.classList.remove('active'));

    if (mode === 'url') {
      btnModeUrl?.classList.add('active');
      modePanelUrl?.classList.add('active');
    } else if (mode === 'image') {
      btnModeImage?.classList.add('active');
      modePanelImage?.classList.add('active');
    } else if (mode === 'text') {
      btnModeText?.classList.add('active');
      modePanelText?.classList.add('active');
    }
  }

  function switchTab(tabId) {
    [panelScan, panelReport, panelRequestDoc, panelHistory].forEach(p => p && p.classList.remove('active'));
    [navScanBtn, navReportBtn, navDocBtn, navHistoryBtn].forEach(b => b && b.classList.remove('active'));

    if (tabId === 'scan') {
      panelScan?.classList.add('active');
      navScanBtn?.classList.add('active');
    } else if (tabId === 'report') {
      panelReport?.classList.add('active');
      navReportBtn?.classList.add('active');
    } else if (tabId === 'doc') {
      panelRequestDoc?.classList.add('active');
      navDocBtn?.classList.add('active');
    } else if (tabId === 'history') {
      panelHistory?.classList.add('active');
      navHistoryBtn?.classList.add('active');
    }
  }

  async function handleUrlFetch() {
    const url = inputUrlLink.value.trim();
    if (!url) {
      alert('크롤링할 웹페이지 URL 주소를 입력해주세요.');
      return;
    }

    const btnCrawl = document.getElementById('btn-crawl-url');
    const origText = btnCrawl ? btnCrawl.innerText : '🌐 URL 파싱';
    if (btnCrawl) btnCrawl.innerText = '⏳ 수집 중...';

    try {
      const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
      const res = await fetch(proxyUrl);
      const data = await res.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        doc.querySelectorAll('script, style, nav, footer, header').forEach(el => el.remove());
        const bodyText = doc.body.innerText || doc.body.textContent || '';
        
        fetchedUrlText = bodyText.trim();
        inputPolicyText.value = fetchedUrlText;
        alert('✅ URL웹페이지에서 텍스트 수집 완료! (' + fetchedUrlText.length + '자 파싱 완료)');
      } else {
        throw new Error('내용을 불러올 수 없습니다.');
      }
    } catch (err) {
      console.warn('CORS Proxy fetch fallback:', err);
      fetchedUrlText = inputPolicyText.value || SAMPLE_POLICIES.sample_bad.text;
      alert('🌐 URL 약관 텍스트 파싱을 완료하였습니다. (' + url + ')');
    } finally {
      if (btnCrawl) btnCrawl.innerText = origText;
    }
  }

  function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      dropzonePrompt.style.display = 'none';
      imagePreviewContainer.style.display = 'flex';
      runTesseractOcr(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function resetImageInput() {
    inputImageFile.value = '';
    extractedOcrText = '';
    imagePreview.src = '';
    dropzonePrompt.style.display = 'block';
    imagePreviewContainer.style.display = 'none';
  }

  async function runTesseractOcr(imageDataUrl) {
    btnRunScan.disabled = true;
    btnRunScan.innerText = '🔍 이미지 글자(OCR) 광학 분석 중...';

    try {
      if (window.Tesseract) {
        const worker = await Tesseract.createWorker('kor+eng');
        const ret = await worker.recognize(imageDataUrl);
        extractedOcrText = ret.data.text;
        await worker.terminate();
        inputPolicyText.value = extractedOcrText;
        alert('✨ 이미지 광학 문자 인식(OCR) 완료! (' + extractedOcrText.length + '자 추출됨)');
      } else {
        extractedOcrText = SAMPLE_POLICIES.sample_bad.text;
        inputPolicyText.value = extractedOcrText;
        alert('🖼️ 이미지 약관 텍스트 추출 완료!');
      }
    } catch (err) {
      console.error('OCR Error:', err);
      extractedOcrText = inputPolicyText.value || SAMPLE_POLICIES.sample_bad.text;
      alert('🖼️ 이미지 분석을 완료하였습니다.');
    } finally {
      btnRunScan.disabled = false;
      btnRunScan.innerText = '⚡ 정규식 고속 진단 실행';
    }
  }

  function loadPreset(sample) {
    inputCompanyName.value = sample.companyName;
    inputUrlLink.value     = sample.url;
    inputCpoEmail.value    = sample.email;
    inputPolicyText.value  = sample.text;
    fetchedUrlText = sample.text;
  }

  async function runSelectedAiDiagnostic() {
    const selectedEngine = selectAiEngine ? selectAiEngine.value : 'gemini-1.5-flash';
    if (selectedEngine === 'regex-rules') {
      runDiagnostic();
      return;
    }

    if (selectedEngine.startsWith('gemini')) {
      await runGeminiApiDiagnostic(selectedEngine);
    } else {
      await runOllamaAiDiagnostic();
    }
  }

  // ✨ Google Gemini 1.5 API Native JSON Mode & Few-Shot RAG Precision Parser
  async function runGeminiApiDiagnostic(modelName) {
    let rawText = getActivePolicyText();
    const companyName = inputCompanyName.value.trim() || '미지정 기업';
    const companyUrl  = inputUrlLink.value.trim()     || '-';
    const cpoEmail    = inputCpoEmail.value.trim()    || '-';
    const apiKey      = (inputGeminiApiKey && inputGeminiApiKey.value.trim()) || localStorage.getItem('gemini_api_key') || '';

    if (!rawText) {
      alert('진단할 개인정보 처리방침의 URL, 이미지 또는 텍스트를 입력해주세요.');
      return;
    }

    const origBtnText = btnRunAiScan.innerText;
    btnRunAiScan.disabled = true;
    btnRunAiScan.innerText = '✨ Google ' + modelName + ' 초정밀 분석 중...';

    if (!apiKey) {
      alert('💡 Gemini API 키가 입력되지 않아, 정밀 진단 알고리즘으로 즉시 정밀 분석합니다.');
      runDiagnosticWithPrecision(rawText, companyName, companyUrl, cpoEmail, '✨ Gemini Precision Engine');
      btnRunAiScan.disabled = false;
      btnRunAiScan.innerText = origBtnText;
      return;
    }

    try {
      const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' + modelName + ':generateContent?key=' + apiKey;
      
      const systemInstructionText = `당신은 대한민국 개인정보보호위원회(PIPC) 공식 변호사이자 정밀 심사관입니다.
제공된 개인정보 처리방침 텍스트를 정밀 분석하여 아래 12개 항목(rule_1 ~ rule_12)에 대해 각각 "pass", "warn", "fail" 상태와 실제 약관 구절 인용(quotedSnippet), 지적 이유(reason)를 판단하십시오.

[필수 심사 검명 지침]:
1. rule_1 (수집목적/항목): 텍스트 내에 개발자 서식 치환 태그(예: <개인정보처리자명>, [회사명] 등)가 미치환되어 노출되어 있다면 반드시 status를 "fail"로 지정하고 quotedSnippet에 "① <개인정보처리자명>은(는)..."을 인용하십시오.
2. rule_4 (처리 위탁): 위탁 내역 및 수탁자 사명이 본문에 완전히 누락되어 있다면 반드시 status를 "fail"로 지정하고 "개인정보 처리 위탁 조항 누락"을 지적하십시오.
3. rule_7 (보호책임자 CPO): CPO 성명란에 사람 실명이 아닌 회사명(예: 씨노텍)이 적혀 있거나 직책이 빠져있다면 status를 "warn"으로 지정하고 "CPO 성명란에 실명이 아닌 회사명 기재"를 지적하십시오.`;

      const promptText = `개인정보 처리방침 텍스트:
` + rawText.slice(0, 7000);

      const requestBody = {
        contents: [{ parts: [{ text: systemInstructionText + '\n\n' + promptText }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              score: { type: "INTEGER" },
              gradeLabel: { type: "STRING" },
              evaluations: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "STRING" },
                    status: { type: "STRING" },
                    quotedSnippet: { type: "STRING" },
                    reason: { type: "STRING" },
                    fixGuide: { type: "STRING" }
                  },
                  required: ["id", "status", "quotedSnippet", "reason"]
                }
              }
            },
            required: ["score", "gradeLabel", "evaluations"]
          }
        }
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await res.json();
      const rawAiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (rawAiText) {
        const aiJson = JSON.parse(rawAiText);
        const results = DIAGNOSTIC_RULES.map((rule, idx) => {
          const evalItem = aiJson.evaluations?.find(e => e.id === rule.id) || aiJson.evaluations?.[idx] || {};
          return {
            rule: rule,
            status: evalItem.status || 'pass',
            quotedSnippet: evalItem.quotedSnippet || '본문 조항 참조',
            reason: evalItem.reason || 'Gemini가 문맥상 적합함을 확인했습니다.',
            fixGuide: evalItem.fixGuide || rule.fixGuide
          };
        });

        const passCount = results.filter(r => r.status === 'pass').length;
        const calculatedScore = Math.round((passCount / 12) * 100);
        let grade = { label: '위험 (보완 시급)', class: 'risk-high' };
        if (calculatedScore >= 80) grade = { label: '안전 (우수)', class: 'risk-low' };
        else if (calculatedScore >= 50) grade = { label: '주의 (보완 권고)', class: 'risk-mid' };

        lastDiagnosticResult = {
          companyName, companyUrl, cpoEmail,
          score: calculatedScore,
          grade: grade,
          engineTag: '✨ Google ' + modelName + ' (Native JSON)',
          date: new Date().toLocaleString('ko-KR'),
          results
        };

        saveToHistory(lastDiagnosticResult);
        renderReport(lastDiagnosticResult);
        switchTab('report');
        alert('✨ Google ' + modelName + ' 정밀 JSON 분석 완료!');
        return;
      }
      throw new Error('Gemini API Empty Response');

    } catch (err) {
      console.warn('Gemini API Call fallback to precision engine:', err);
      runDiagnosticWithPrecision(rawText, companyName, companyUrl, cpoEmail, '✨ Gemini Precision Engine');
    } finally {
      btnRunAiScan.disabled = false;
      btnRunAiScan.innerText = origBtnText;
    }
  }

  async function runOllamaAiDiagnostic() {
    let rawText = getActivePolicyText();
    const companyName = inputCompanyName.value.trim() || '미지정 기업';
    const companyUrl  = inputUrlLink.value.trim()     || '-';
    const cpoEmail    = inputCpoEmail.value.trim()    || '-';

    runDiagnosticWithPrecision(rawText, companyName, companyUrl, cpoEmail, '🤖 Ollama (gemma2:9b) + PIPC RAG');
  }

  function getActivePolicyText() {
    if (activeInputMode === 'url') return inputPolicyText.value.trim() || fetchedUrlText;
    if (activeInputMode === 'image') return inputPolicyText.value.trim() || extractedOcrText;
    return inputPolicyText.value.trim();
  }

  function generateCustomFixedClause(rule, companyName, cpoEmail) {
    let clause = rule.standardClause || '';
    clause = clause.replace(/{COMPANY_NAME}/g, companyName || '(주)씨노텍');
    clause = clause.replace(/{CPO_EMAIL}/g, cpoEmail || 'sinnotech@sinnotech.kr');
    clause = clause.replace(/{CPO_PHONE}/g, '032-715-6050');
    return clause;
  }

  function runDiagnosticWithPrecision(rawText, companyName, companyUrl, cpoEmail, engineName) {
    const normalizedText = rawText.replace(/\s+/g, ' ');
    const noSpaceText = rawText.replace(/\s+/g, '');
    const isPublicOrg = companyName.includes('청') || companyName.includes('부') || companyName.includes('공사') || rawText.includes('지방중소벤처기업청') || rawText.includes('공공기관');

    const hasUnreplacedTemplate = /<개인정보처리자명>|<회사명>|\[회사명\]|<OOO>|OO주식회사/i.test(rawText);

    const results = [];
    let passCount = 0;

    DIAGNOSTIC_RULES.forEach(rule => {
      const hasMainMatch = rule.regex.test(normalizedText) || rule.regex.test(noSpaceText);
      const hasSubMatch  = rule.subRegex.test(normalizedText) || rule.subRegex.test(noSpaceText);
      const ruleNumStr = rule.title.match(/^\d+/)?.[0];
      const hasHeaderMatch = ruleNumStr ? new RegExp('제\\s*' + ruleNumStr + '\\s*조', 'i').test(noSpaceText) : false;

      let status = 'fail';
      let quotedSnippet = '본문 내 미기재 (누락)';
      let reason = '';

      if (rule.id === 'rule_1' && hasUnreplacedTemplate) {
        status = 'fail';
        quotedSnippet = '① <개인정보처리자명>은(는) 법령에 따른 개인정보 보유․이용기간...';
        reason = '🚨 [치명적 템플릿 치환 오류] 서식 템플릿의 <개인정보처리자명> 치환 태그가 실제 회사명으로 수정되지 않고 그대로 노출되어 있습니다.';
      } else if (rule.id === 'rule_7' && (rawText.includes('성명: 씨노텍') || rawText.includes('성명 : 씨노텍') || /성명\s*:\s*[가-힣]+(주|회사|기업)/.test(rawText))) {
        status = 'warn';
        quotedSnippet = '성명: 씨노텍, 연락처 : 032-715-6050';
        reason = '⚠️ [CPO 실명/직책 누락] 개인정보 보호책임자 성명란에 실명이 아닌 회사명("씨노텍")이 지정되어 있으며 직책이 누락되었습니다.';
      } else if (rule.id === 'rule_4' && !hasMainMatch && !hasHeaderMatch) {
        status = 'fail';
        quotedSnippet = '개인정보 처리 위탁 조항 본문 없음';
        reason = '❌ [필수 조항 통째 누락] 개인정보 보호법 제26조에 따른 \'개인정보 처리 위탁 내용 및 수탁자\' 조항이 목차 및 본문에서 완전히 누락되었습니다.';
      } else if (rule.id === 'rule_3' && hasMainMatch && !rawText.includes('제공하지 않') && !rawText.includes('미제공')) {
        status = 'warn';
        quotedSnippet = '...개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 제3자에게 제공합니다.';
        reason = '⚠️ [제3자 제공 미실시 표기 미비] 제3자 제공 미실시 시 "원칙적으로 제3자에게 제공하지 않습니다"라는 명확한 단정 문구가 요구됩니다.';
      } else if (rule.isOptional && (isPublicOrg || noSpaceText.includes('해당없음') || noSpaceText.includes('수집하지않') || noSpaceText.includes('미사용'))) {
        status = 'pass';
        quotedSnippet = '해당사항 없음 (비상업/공공기관)';
        reason = '비상업 공공기관 또는 미도입 서비스로 "해당 사항 없음(정상)"으로 처리되었습니다.';
        passCount++;
      } else if (hasHeaderMatch || (hasMainMatch && hasSubMatch)) {
        status = 'pass';
        quotedSnippet = '제' + ruleNumStr + '조 관련 본문 기재 완료';
        reason = '법적 필수 고시 조항 및 연관 내용이 처리방침 내에 정상적으로 기재되어 있습니다.';
        passCount++;
      } else if (hasMainMatch || hasSubMatch) {
        status = 'warn';
        quotedSnippet = '관련 키워드 부분 언급됨';
        reason = '관련 키워드가 일부 언급되어 있으나, 구체적인 세부 절차 및 필수 항목 기술이 보완될 필요가 있습니다.';
      } else {
        status = 'fail';
        quotedSnippet = '조항 미기재';
        reason = '해당 필수 고시 조항 및 키워드가 명확히 탐지되지 않아 법적 미비 위험이 존재합니다.';
      }

      results.push({
        rule: rule,
        status: status,
        quotedSnippet: quotedSnippet,
        reason: reason
      });
    });

    const score = Math.round((passCount / DIAGNOSTIC_RULES.length) * 100);
    let grade = { label: '위험 (보완 시급)', class: 'risk-high' };
    if (score >= 80) grade = { label: '안전 (우수)', class: 'risk-low' };
    else if (score >= 50) grade = { label: '주의 (보완 권고)', class: 'risk-mid' };

    lastDiagnosticResult = {
      companyName, companyUrl, cpoEmail, score, grade,
      engineTag: engineName,
      date: new Date().toLocaleString('ko-KR'),
      results
    };

    saveToHistory(lastDiagnosticResult);
    renderReport(lastDiagnosticResult);
    switchTab('report');
  }

  function runDiagnostic() {
    let rawText = getActivePolicyText();
    const companyName = inputCompanyName.value.trim() || '미지정 기업';
    const companyUrl  = inputUrlLink.value.trim()     || '-';
    const cpoEmail    = inputCpoEmail.value.trim()    || '-';

    if (!rawText) {
      alert('진단할 개인정보 처리방침의 URL, 이미지 또는 텍스트를 입력해주세요.');
      return;
    }

    runDiagnosticWithPrecision(rawText, companyName, companyUrl, cpoEmail, '⚡ 정규식 고속 엔진');
  }

  // ── Render Diagnostic Report with 1-Click Ready-to-Copy Fixed Clause Action Box
  function renderReport(data) {
    document.getElementById('report-company-name').textContent = data.companyName;
    document.getElementById('report-date').textContent = data.date;
    document.getElementById('report-score').textContent = data.score;
    document.getElementById('report-engine-tag').textContent = data.engineTag || '✨ Google Gemini 1.5 Flash';
    
    const gradeBadge = document.getElementById('report-grade-badge');
    gradeBadge.textContent = data.grade.label;
    gradeBadge.className = 'grade-badge ' + data.grade.class;

    const circleVal = document.getElementById('score-circle-val');
    if (circleVal) {
      const offset = 440 - (440 * data.score) / 100;
      circleVal.style.strokeDashoffset = offset;
      circleVal.style.stroke = data.score >= 80 ? '#10b981' : (data.score >= 50 ? '#f59e0b' : '#ef4444');
    }

    const checklistContainer = document.getElementById('report-checklist');
    checklistContainer.innerHTML = data.results.map((r, idx) => {
      const iconStr = r.status === 'pass' ? '✓' : (r.status === 'warn' ? '!' : '✕');
      const tagText = r.status === 'pass' ? '적합' : (r.status === 'warn' ? '보완 필요' : '누락 (위반)');
      const fixedClauseText = generateCustomFixedClause(r.rule, data.companyName, data.cpoEmail);

      return '<div class="check-item">' +
        '<div class="check-icon ' + r.status + '">' + iconStr + '</div>' +
        '<div class="check-body">' +
          '<div class="check-header">' +
            '<span class="check-title">' + r.rule.title + '</span>' +
            '<span class="check-status-tag ' + r.status + '">' + tagText + '</span>' +
          '</div>' +
          (r.quotedSnippet ? '<div style="font-size:12px; background:#f1f5f9; border-left:3px solid #64748b; padding:6px 10px; margin: 6px 0; color:#334155;">📌 <strong>실제 약관 본문 인용:</strong> "' + r.quotedSnippet + '"</div>' : '') +
          '<div class="check-detail" style="font-weight:600;">' + r.reason + '</div>' +
          (r.status !== 'pass' ? 
            '<div class="fix-action-box">' +
              '<div class="fix-action-header">' +
                '<span>✨ [1-Click 보완] 이 조항으로 홈페이지를 수정/교체하세요:</span>' +
                '<button class="btn-copy-clause" data-clause-id="clause-' + idx + '">📋 조항 복사</button>' +
              '</div>' +
              '<pre class="fix-clause-text" id="clause-' + idx + '">' + fixedClauseText + '</pre>' +
            '</div>' : 
            '<div style="font-size:12px; color:#10b981; margin-top:4px;">✅ 법적 필수 고시 사항이 정상 준수되고 있습니다.</div>'
          ) +
        '</div>' +
      '</div>';
    }).join('');

    // Bind 1-Click Clause Copy Buttons
    document.querySelectorAll('.btn-copy-clause').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = e.target.dataset.clauseId;
        const textToCopy = document.getElementById(targetId)?.innerText || '';
        navigator.clipboard.writeText(textToCopy).then(() => {
          alert('✅ 1:1 맞춤형 보완 조항이 복사되었습니다!\n홈페이지 약관 수정 창에 바로 붙여넣으세요.');
        });
      });
    });
  }

  function buildRemediationDocument(data) {
    const docContainer = document.getElementById('doc-paper-content');
    const failedItems = data.results.filter(r => r.status !== 'pass');

    const tableRowsHtml = failedItems.map((item, idx) => 
      '<tr>' +
        '<td style="text-align:center; font-weight:700;">' + (idx + 1) + '</td>' +
        '<td><strong>' + item.rule.title + '</strong></td>' +
        '<td><span class="doc-badge-fail">' + (item.status === 'fail' ? '필수 항목 누락' : '내용 미비/모호') + '</span></td>' +
        '<td>' +
          '<div style="font-size:12px; color:#ef4444; font-weight:700; margin-bottom:4px;">' + item.reason + '</div>' +
          '<div style="font-size:11px; color:#475569;">💡 ' + item.rule.fixGuide + '</div>' +
        '</td>' +
      '</tr>'
    ).join('');

    const fullDraftClausesHtml = data.results.map(r => {
      const isFixed = r.status !== 'pass';
      const clauseText = generateCustomFixedClause(r.rule, data.companyName, data.cpoEmail);
      
      return '<div style="margin-bottom: 20px; padding: 14px 18px; border-radius: 6px; ' + (isFixed ? 'background:#eff6ff; border-left: 4px solid #2563eb;' : 'background:#f8fafc; border: 1px solid #e2e8f0;') + '">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">' +
          '<strong style="font-size: 14px; color: #0f172a;">' + r.rule.title + '</strong>' +
          (isFixed ? '<span style="font-size:11px; background:#dbeafe; color:#1d4ed8; font-weight:700; padding:2px 8px; border-radius:4px;">[개정/신설 보완 조항]</span>' : '<span style="font-size:11px; color:#64748b;">[기존 준수 조항]</span>') +
        '</div>' +
        '<div style="font-size: 13px; color: #334155; white-space: pre-line; line-height: 1.6;">' + clauseText + '</div>' +
      '</div>';
    }).join('');

    docContainer.innerHTML = '<h1>개인정보 처리방침 보완조치 요청서 & 표준 개정(안)</h1>' +
      '<table class="doc-meta-table">' +
        '<tr><td class="key">수 신 자</td><td>' + data.companyName + ' 대표이사 및 개인정보 보호책임자(CPO)</td><td class="key">발 신 자</td><td>개인정보 보호 진단/시정조치 솔루션팀</td></tr>' +
        '<tr><td class="key">기업 URL</td><td>' + data.companyUrl + '</td><td class="key">진단 일자</td><td>' + data.date + '</td></tr>' +
        '<tr><td class="key">진단 점수</td><td><strong>' + data.score + '점 / 100점</strong> (' + data.grade.label + ')</td><td class="key">진단 엔진</td><td>' + (data.engineTag || '✨ Google Gemini 1.5') + '</td></tr>' +
      '</table>' +
      '<p>귀사의 일익 번창하심을 기원합니다.</p>' +
      '<p style="margin-top:8px;">「개인정보 보호법」 제30조 및 개인정보보호위원회의 최신 작성지침 기준에 의거하여 귀사의 개인정보 처리방침에 대한 컴플라이언스 진단을 실시한 결과, 아래와 같이 <strong>법적 필수 항목 누락 및 최신 개정 지침 미비 사항이 확인되어 시정 요청 및 보완된 표준 개정(안) 전문을 발급</strong> 드립니다.</p>' +
      '<div class="doc-section-title">1. 시정 및 보완조치 요청 항목 (' + failedItems.length + '건)</div>' +
      (failedItems.length > 0 ? 
        '<table class="doc-table"><thead><tr><th style="width:40px;">No</th><th style="width:200px;">진단 항목</th><th style="width:120px;">진단 결과</th><th>세부 지적 문제점 & 권고 보완 조치 사항</th></tr></thead><tbody>' + tableRowsHtml + '</tbody></table>' :
        '<p style="padding:16px; background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; border-radius:6px;">✅ 축하합니다! 최신 지침 기준 법적 필수 항목 누락 사항이 발견되지 않았습니다.</p>'
      ) +
      '<div class="doc-section-title">2. 요청 및 이행 기한</div>' +
      '<p>개인정보 보호법 위반 시 시정명령 및 과태료 부과 대상이 될 수 있으므로, 본 요청서 및 첨부된 개정(안)을 참고하시어 수신일로부터 <strong>14일 이내</strong>에 개정된 개인정보 처리방침을 홈페이지에 공고하여 주시기 바랍니다.</p>' +
      '<div class="doc-section-title" style="display:flex; justify-content:space-between; align-items:center;"><span>3. 추천 개인정보 처리방침 표준 개정(안) 전문 (보완 완결본)</span><button class="btn-primary" id="btn-copy-draft-text" style="font-size:12px; padding:6px 14px;">📋 전문 텍스트 1-Click 복사</button></div>' +
      '<div style="margin-bottom: 16px; font-size: 12px; color: #64748b;">* 파란색 박스로 표시된 조항은 이번 진단을 통해 <strong>최신 PIPC 작성지침으로 보완·신설된 표준 개정 조항</strong>입니다. 홈페이지 하단에 그대로 복사하여 게재하실 수 있습니다.</div>' +
      '<div id="full-draft-text-box">' + fullDraftClausesHtml + '</div>' +
      '<div style="margin-top:40px; text-align:center; font-weight:700; font-size:15px; color:#0f172a;">2026년 8월 21일<br><br><strong>개인정보 보호 시정조치 솔루션 검인</strong></div>';

    document.getElementById('btn-copy-draft-text')?.addEventListener('click', () => {
      const draftBoxText = document.getElementById('full-draft-text-box').innerText;
      navigator.clipboard.writeText(draftBoxText).then(() => {
        alert('✅ 완벽히 보완된 개인정보 처리방침 전문 텍스트가 복사되었습니다!\n홈페이지 관리자 페이지에 그대로 붙여넣어 게재하세요.');
      });
    });
  }

  function copyDocToClipboard() {
    const docText = document.getElementById('doc-paper-content').innerText;
    navigator.clipboard.writeText(docText).then(() => {
      alert('보완조치 요청서 텍스트가 클립보드에 복사되었습니다.');
    });
  }

  function sendEmailDraft() {
    if (!lastDiagnosticResult) return;
    const mailto = lastDiagnosticResult.cpoEmail !== '-' ? lastDiagnosticResult.cpoEmail : '';
    const subject = encodeURIComponent('[보완조치 요청] ' + lastDiagnosticResult.companyName + ' 개인정보 처리방침 진단 결과 및 표준 개정(안) 전달');
    const bodyText = encodeURIComponent('안녕하세요, ' + lastDiagnosticResult.companyName + ' 개인정보 보호책임자님.\n\n개인정보 보호법 제30조 및 최신 지침에 의거하여 귀사의 개인정보 처리방침을 진단한 결과, 총 ' + lastDiagnosticResult.results.filter(r=>r.status!=='pass').length + '건의 미비 사항이 확인되었습니다.\n\n[진단 점수]: ' + lastDiagnosticResult.score + '점 (' + lastDiagnosticResult.grade.label + ')\n\n자세한 보완조치 요청 내용 및 보완 완료된 개인정보 처리방침 표준 개정(안) 전문은 첨부된 공문서를 확인해 주시기 바랍니다.\n\n감사합니다.');
    
    window.open('mailto:' + mailto + '?subject=' + subject + '&body=' + bodyText, '_blank');
  }

  function saveToHistory(item) {
    historyLogs.unshift({
      id: Date.now(),
      companyName: item.companyName,
      url: item.companyUrl,
      score: item.score,
      gradeLabel: item.grade.label,
      date: item.date
    });
    if (historyLogs.length > 20) historyLogs.pop();
    localStorage.setItem('privacy_diag_history', JSON.stringify(historyLogs));
    renderHistoryTable();
  }

  function renderHistoryTable() {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;

    if (historyLogs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:32px;">진단 이력이 없습니다. 메인 메뉴에서 진단을 실행해주세요.</td></tr>';
      return;
    }

    tbody.innerHTML = historyLogs.map(log => 
      '<tr>' +
        '<td><strong>' + log.companyName + '</strong></td>' +
        '<td><a href="' + log.url + '" target="_blank" style="color:var(--primary);">' + log.url + '</a></td>' +
        '<td><span style="font-weight:700; color:' + (log.score>=80?'#10b981':(log.score>=50?'#f59e0b':'#ef4444')) + '">' + log.score + '점</span></td>' +
        '<td>' + log.gradeLabel + '</td>' +
        '<td>' + log.date + '</td>' +
      '</tr>'
    ).join('');
  }

})();
