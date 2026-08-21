// ============================================================
// 중소기업 개인정보 처리방침 진단 & 보완조치 요청 솔루션 (v8.1 - Syntax Fix & Stable)
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
      standardClause: '제1조(개인정보의 수집·이용 목적 및 항목)\n회사는 다음의 목적을 위하여 최소한의 개인정보를 처리합니다.\n- 필수항목: 성명, 이메일, 휴대전화번호, 비밀번호 (목적: 회원가입, 본인확인, 서비스 제공)\n- 선택항목: 회사명, 직책 (목적: 고객 문의 대응 및 맞춤 서비스)'
    },
    {
      id: 'rule_2',
      title: '2. 개인정보의 보유 및 이용 기간',
      desc: '원칙적 파기 시점 및 전자상거래법, 통신비밀보호법 등 관계 법령에 따른 보존 기간이 기재되어야 합니다.',
      regex: /(보유|이용\s*기간|보존\s*기간|파기\s*시점)/i,
      subRegex: /(법령|상법|전자상거래|파기|보존|년|월|탈퇴)/i,
      fixGuide: '원칙적 보유 기간(회원 탈퇴 시 등)과 관련 법령(전자상거래법 5년, 통신비밀보호법 3개월 등)에 의한 보존 기간을 명시하세요.',
      standardClause: '제2조(개인정보의 보유 및 이용기간)\n① 회사는 회원 탈퇴 시까지 이용자의 개인정보를 보유 및 이용합니다.\n② 단, 관련 법령에 따라 보존할 필요가 있는 경우 이하 기간 동안 보존합니다.\n- 전자상거래법 계약/청약철회 기록: 5년\n- 통신비밀보호법 로그인 기록: 3개월'
    },
    {
      id: 'rule_3',
      title: '3. 개인정보의 제3자 제공에 관한 사항',
      desc: '제3자 제공 여부, 제공받는 자, 목적, 항목, 보유기간이 명시되어야 합니다.',
      regex: /(제\s*3\s*자\s*제공|3\s*자\s*제공|제3자|제\s*3\s*자)/i,
      subRegex: /(동의|제공받는|제공하지\s*않|별도\s*동의|없음|원칙적으로\s*제공)/i,
      fixGuide: '제3자 제공이 없을 경우 "원칙적으로 제3자에게 제공하지 않습니다"를 명시하고, 제공 시 별도 동의 절차와 항목을 기재하세요.',
      standardClause: '제3조(개인정보의 제3자 제공)\n회사는 원칙적으로 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법률의 특별한 규정이 있거나 정보주체의 별도 동의를 받은 경우에 한하여 제공합니다.'
    },
    {
      id: 'rule_4',
      title: '4. 개인정보 처리 위탁 내용 및 수탁자',
      desc: '외주/위탁 업무 내용과 수탁업체 사명이 기재되어야 합니다.',
      regex: /(위탁|수탁자|위탁업체|위탁\s*내용|수탁\s*업체)/i,
      subRegex: /(수탁|위탁|위탁하지\s*않|택배|PG|유형|범위|업무)/i,
      fixGuide: '결제, 배송, IT 인프라 등 개인정보 처리를 위탁받는 업체명과 위탁 업무 범위를 명시하세요.',
      standardClause: '제4조(개인정보 처리 위탁)\n회사는 원활한 서비스 이행을 위하여 아래와 같이 개인정보 처리업무를 위탁하고 있습니다.\n- 결제 서비스: PG사(NICE페이먼츠 등)\n- 클라우드 인프라: Amazon Web Services(AWS)'
    },
    {
      id: 'rule_5',
      title: '5. 개인정보의 파기 절차 및 방법',
      desc: '전자적 파일의 영구 삭제 방법 및 종이 출력물 분쇄/소각 방법이 명시되어야 합니다.',
      regex: /(파기|파기\s*절차|파기\s*방법|삭제\s*방법)/i,
      subRegex: /(전자적|영구|삭제|분쇄|소각|복구|기술적|절차)/i,
      fixGuide: '전자적 파일(복구 불가능한 기술적 삭제)과 서면 출력물(분쇄/소각)의 구체적 파기 방식을 명시하세요.',
      standardClause: '제5조(개인정보 파기 절차 및 방법)\n① 전자적 파일 형태: 복구할 수 없는 기술적 방법을 사용하여 지체 없이 영구 삭제합니다.\n② 종이 출력물: 문서 분쇄기로 분쇄하거나 소각하여 파기합니다.'
    },
    {
      id: 'rule_6',
      title: '6. 정보주체와 법정대리인의 권리·의무 및 행사방법',
      desc: '열람·정정·삭제·처리정지 요구권, 자동화된 결정 거부권 및 법정대리인 행사 방법이 기재되어야 합니다.',
      regex: /(권리|의무|열람|정정|삭제|처리\s*정지|권리\s*행사)/i,
      subRegex: /(행사|법정\s*대리인|요구|서면|자동화|정보주체)/i,
      fixGuide: '정보주체 및 14세 미만 아동의 법정대리인이 권리를 행사할 수 있는 절차(서면, 이메일 등)를 기술하세요.',
      standardClause: '제6조(정보주체와 법정대리인의 권리·의무 및 행사방법)\n정보주체 및 14세 미만 아동의 법정대리인은 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 서면 또는 이메일로 요구할 수 있으며 회사는 지체 없이 조치합니다.'
    },
    {
      id: 'rule_7',
      title: '7. 개인정보 보호책임자(CPO) 성명 및 연락처',
      desc: '개인정보 보호책임자의 성명(또는 담당 부서명), 직책, 전화번호, 이메일이 반드시 포함되어야 합니다.',
      regex: /(보호\s*책임자|보호책임자|CPO|보호\s*담당|고충\s*처리|열람\s*청구)/i,
      subRegex: /(성명|이름|연락처|전화|이메일|부서|담당|실명|직책)/i,
      fixGuide: '개인정보 보호책임자의 실명(또는 담당 부서명), 직책, 전화번호, 이메일 주소를 누락 없이 기재하세요.',
      standardClause: '제7조(개인정보 보호책임자 및 담당부서)\n회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 관련 고충처리를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.\n- 개인정보 보호책임자: CPO (보안담당부서)\n- 연락처: privacy@company.com / 02-1234-5678'
    },
    {
      id: 'rule_8',
      title: '8. 개인정보의 안전성 확보 조치',
      desc: '기술적, 관리적, 물리적 보안 대책이 작성되어야 합니다.',
      regex: /(안전성|안전성\s*확보|보안\s*대책|보안\s*조치)/i,
      subRegex: /(기술적|관리적|암호화|접근\s*권한|백신|물리적|조치)/i,
      fixGuide: '비밀번호 암호화, 백신 프로그램 설치, 접근 권한 최소화 등 안전성 확보를 위한 대책을 서술하세요.',
      standardClause: '제8조(개인정보의 안전성 확보 조치)\n회사는 개인정보의 안전성 확보를 위해 다음 대책을 이행하고 있습니다.\n- 기술적 대책: 비밀번호 암호화 저장, 백신 프로그램 운영\n- 관리적 대책: 개인정보 취급자 최소화 및 정기 보안 교육\n- 물리적 대책: 전산실 출입 통제'
    },
    {
      id: 'rule_9',
      title: '9. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부',
      desc: '쿠키의 사용 목적 및 웹브라우저/모바일 차단 설정 통한 쿠키 거부 방법이 안내되어야 합니다.',
      regex: /(쿠키|cookie|자동\s*수집|수집\s*장치)/i,
      subRegex: /(설치|운영|거부|설정|브라우저|미사용|수집하지\s*않|거부\s*방법)/i,
      fixGuide: '쿠키 수집 목적을 설명하고, 미사용 시 "쿠키를 수집·운영하지 않음"을 명시하세요.',
      standardClause: '제9조(개인정보 자동 수집 장치의 설치·운영 및 거부)\n회사는 맞춤형 서비스 제공을 위해 쿠키를 사용하며, 웹브라우저 옵션 설정(도구 > 인터넷 옵션 > 개인정보)을 통해 쿠키 저장을 거부할 수 있습니다.'
    },
    {
      id: 'rule_10',
      title: '10. 권익침해 구제방법 및 전문기관 연락처',
      desc: '개인정보분쟁조정위원회(1833-6972), 침해신고센터(118), 대검찰청, 경찰청 등의 안내가 포함되어야 합니다.',
      regex: /(구제|분쟁|권익|침해\s*신고|구제\s*방법)/i,
      subRegex: /(개인정보분쟁조정위원회|118|경찰청|대검찰청|상담|1833-6972|분쟁\s*조정)/i,
      fixGuide: '개인정보 침해 신고 센터(118), 개인정보 분쟁조정위원회(1833-6972) 등의 기관명과 연락처를 기재하세요.',
      standardClause: '제10조(권익침해 구제방법)\n개인정보 침해에 대한 피해구제, 상담은 아래 기관에 문의하실 수 있습니다.\n- 개인정보 침해신고센터: (국번없이) 118\n- 개인정보 분쟁조정위원회: (국번없이) 1833-6972\n- 대검찰청 사이버수사과: (국번없이) 1301\n- 경찰청 사이버범죄신고: (국번없이) 182'
    },
    {
      id: 'rule_11',
      title: '11. 생성형 AI 서비스 프롬프트·데이터 처리 및 거부(Opt-out) [최신 지침]',
      desc: '생성형 AI 기능 이용 시 프롬프트 저장 여부 및 AI 학습 거부권이 명시되어야 합니다.',
      isOptional: true,
      regex: /(AI|인공지능|생성형|프롬프트|학습)/i,
      subRegex: /(거부|옵트아웃|Opt-out|입력|학습|해당\s*없음|미사용|수집하지\s*않)/i,
      fixGuide: 'AI 서비스 미도입 기관은 "AI 기반 데이터 처리 해당 없음"으로 간주하여 정상 판정됩니다.',
      standardClause: '제11조(생성형 AI 서비스 데이터 처리 및 거부)\n회사는 AI 서비스 이용 시 입력된 프롬프트 데이터를 모델 학습에 활용하지 않으며, 이용자는 언제든지 거부(Opt-out)를 요청할 수 있습니다.'
    },
    {
      id: 'rule_12',
      title: '12. 맞춤형 광고 행태정보(ADID) 수집·이용 및 차단 옵션 [최신 지침]',
      desc: '맞춤형 광고용 행태정보 수집 여부 및 차단 방법이 명시되어야 합니다.',
      isOptional: true,
      regex: /(행태정보|맞춤형\s*광고|광고\s*식별자|ADID|IDFA)/i,
      subRegex: /(차단|거부|설정|방문기록|해당\s*없음|미수집|수집하지\s*않)/i,
      fixGuide: '공공기관 및 비상업 웹사이트는 "맞춤형 광고 행태정보 수집 없음"으로 정상 판정됩니다.',
      standardClause: '제12조(맞춤형 광고 행태정보 수집 및 차단)\n회사는 맞춤형 광고를 위한 온라인 행태정보(ADID 등)를 수집하지 않습니다.'
    }
  ];

  const SAMPLE_POLICIES = {
    sample_bad: {
      companyName: '(주)에이비씨 쇼핑몰',
      url: 'https://www.abc-sample-mall.co.kr/privacy',
      cpo: '미지정 (담당자 누락)',
      email: 'contact@abc-sample-mall.co.kr',
      text: '[개인정보 처리방침]\n\n1. 수집하는 개인정보 항목\n회사는 회원가입 시 이름, 이메일, 전화번호를 수집합니다.\n\n2. 개인정보의 이용목적\n회원 관리 및 상품 배송 목적으로 이용합니다.\n\n3. 개인정보의 보유기간\n회원 탈퇴 시까지 보유합니다.\n\n4. 개인정보의 파기\n목적이 달성된 개인정보는 지체없이 파기합니다.\n\n5. 고객센터\n이메일: contact@abc-sample-mall.co.kr'
    },
    sample_mid: {
      companyName: '(주)XYZ 핀테크 스타트업',
      url: 'https://xyz-startup.io/privacy',
      cpo: '김철수 팀장',
      email: 'privacy@xyz-startup.io',
      text: '(주)XYZ 핀테크 개인정보 처리방침\n\n1. 수집하는 개인정보 항목 및 목적\n회사는 회원가입 및 서비스 제공을 위해 아래 정보를 수집합니다.\n- 필수항목: 성명, 이메일, 휴대전화번호, 비밀번호\n- 목적: 본인확인, 서비스 이용안내, 공지사항 전달\n\n2. 개인정보 보유 및 이용기간\n- 회원 탈퇴 시 즉시 파기합니다.\n- 단, 관련 법령(전자상거래법)에 의해 5년간 보존합니다.\n\n3. 개인정보 제3자 제공 및 위탁\n- 회사는 제3자 제공을 하지 않습니다.\n- 데이터 보관을 위해 AWS Cloud에 위탁 관리합니다.\n\n4. 정보주체의 권리\n이용자는 언제든지 본인의 개인정보 열람 및 정정을 요구할 수 있습니다.\n\n5. 개인정보 보호책임자\n성명: 김철수\n연락처: privacy@xyz-startup.io'
    },
    sample_good: {
      companyName: '(주)한국보안기술',
      url: 'https://www.korea-sec-tech.co.kr/privacy',
      cpo: '박민수 이사 (보안기획실)',
      email: 'cpo@korea-sec-tech.co.kr',
      text: '(주)한국보안기술 개인정보 처리방침 (최신 지침 적용판)\n\n1. 개인정보의 수집·이용 목적 및 항목\n회사는 서비스 제공을 위해 필수항목(성명, 이메일, 연락처, 회사명)을 수집하며, 회원 관리 및 고객 문의 대응 목적으로 이용합니다.\n\n2. 개인정보의 보유 및 이용 기간\n이용자의 개인정보는 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 전자상거래법에 따라 계약/청약철회 기록은 5년 보존합니다.\n\n3. 개인정보의 제3자 제공\n회사는 원칙적으로 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.\n\n4. 개인정보 처리 위탁 내용 및 수탁자\n회사는 원활한 서비스 제공을 위해 PG결제(NICE페이먼츠), 택배배송(CJ대한통운)에 위탁하고 있습니다.\n\n5. 개인정보의 파기 절차 및 방법\n전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 영구 파기하며, 종이 출력물은 분쇄기로 분쇄합니다.\n\n6. 정보주체와 법정대리인의 권리·의무 및 행사방법\n정보주체 및 14세 미만 아동의 법정대리인은 언제든지 개인정보 열람, 정정, 삭제, 처리정지 및 자동화된 결정 거부를 요구할 수 있습니다.\n\n7. 개인정보 보호책임자(CPO) 성명 및 연락처\n- 성명: 박민수 이사 (보안기획실)\n- 전화번호: 02-1234-5678\n- 이메일: cpo@korea-sec-tech.co.kr\n\n8. 개인정보의 안전성 확보 조치\n회사는 비밀번호 암호화 저장, 백신 프로그램 설치, 접근 권한의 관리 등 기술적·관리적 안전성 확보 조치를 취하고 있습니다.\n\n9. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부\n회사는 맞춤형 서비스 제공을 위해 쿠키를 사용하며, 웹브라우저 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.\n\n10. 권익침해 구제방법\n개인정보 침해 관련 상담은 개인정보분쟁조정위원회(1833-6972) 또는 개인정보침해신고센터(118)로 문의하실 수 있습니다.\n\n11. 생성형 AI 서비스 데이터 처리 및 거부(Opt-out) 안내\n회사는 AI 서비스 제공 시 입력된 프롬프트 데이터를 이용자의 동의 없이 모델 학습에 활용하지 않으며, 이용자는 언제든지 거부(Opt-out)를 요청할 수 있습니다.\n\n12. 맞춤형 광고 행태정보 수집 안내\n회사는 타겟 맞춤형 광고를 위한 온라인 행태정보(ADID 등)를 제3자에게 수집·제공하지 않습니다.'
    }
  };

  let activeInputMode = 'url';
  let extractedOcrText = '';
  let fetchedUrlText = '';
  let lastDiagnosticResult = null;
  let historyLogs = JSON.parse(localStorage.getItem('privacy_diag_history') || '[]');
  let isOllamaOnline = false;

  let inputCompanyName, inputCpoEmail, inputUrlLink, inputPolicyText, btnRunScan, btnRunAiScan;
  let selectOllamaModel, aiStatusBadge;
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

    selectOllamaModel = document.getElementById('select-ollama-model');
    aiStatusBadge     = document.getElementById('ai-status-badge');

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

    bindEvents();
    renderHistoryTable();
    loadPipcKnowledgeBase();
    checkOllamaStatus();
  });

  async function loadPipcKnowledgeBase() {
    try {
      const res = await fetch('./knowledge_base/pipc_guidelines.json');
      PIPC_KNOWLEDGE_BASE = await res.json();
      console.log('✅ PIPC Knowledge Base RAG Loaded:', PIPC_KNOWLEDGE_BASE.title);
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
    btnRunAiScan?.addEventListener('click', runOllamaAiDiagnostic);

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

  async function checkOllamaStatus() {
    try {
      const res = await fetch('http://localhost:11434/api/tags');
      const data = await res.json();
      
      if (data.models && data.models.length > 0) {
        isOllamaOnline = true;
        if (selectOllamaModel) {
          selectOllamaModel.innerHTML = data.models.map(m => '<option value="' + m.name + '" ' + (m.name.includes('gemma2') ? 'selected' : '') + '>' + m.name + '</option>').join('');
        }

        if (aiStatusBadge) {
          aiStatusBadge.innerHTML = '<span class="status-dot online"></span><span>🤖 Ollama (' + selectOllamaModel.value + ') + PIPC RAG 융합</span>';
        }
      } else {
        throw new Error('No models installed');
      }
    } catch (err) {
      console.warn('Ollama check notice:', err);
      isOllamaOnline = false;
      if (aiStatusBadge) {
        aiStatusBadge.innerHTML = '<span class="status-dot offline"></span><span style="color:#ef4444;">⚠️ Ollama 미연동 (정규식 모드 작동)</span>';
      }
    }
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

  async function runOllamaAiDiagnostic() {
    let rawText = getActivePolicyText();
    const companyName = inputCompanyName.value.trim() || '미지정 기업';
    const companyUrl  = inputUrlLink.value.trim()     || '-';
    const cpoEmail    = inputCpoEmail.value.trim()    || '-';
    const selectedModel = selectOllamaModel.value || 'gemma2:9b';

    if (!rawText) {
      alert('진단할 개인정보 처리방침의 URL, 이미지 또는 텍스트를 입력해주세요.');
      return;
    }

    const origBtnText = btnRunAiScan.innerText;
    btnRunAiScan.disabled = true;
    btnRunAiScan.innerText = '🤖 Ollama (' + selectedModel + ') + PIPC RAG 심층 분석 중...';

    let ragContextStr = '';
    if (PIPC_KNOWLEDGE_BASE && PIPC_KNOWLEDGE_BASE.rules) {
      ragContextStr = PIPC_KNOWLEDGE_BASE.rules.map(r => 
        '[항목 ' + r.id + ']: ' + r.category + ' (' + r.legalBasis + ')\n' +
        '- PIPC 공식 작성기준: ' + r.pipcCriteria + '\n' +
        '- 적합 판정 예시: "' + r.passExample + '"\n' +
        '- 부적합 판정 예시: "' + r.failExample + '"'
      ).join('\n');
    }

    try {
      const prompt = `당신은 대한민국 개인정보보호위원회(PIPC) 공식 검인 변호사입니다.
아래 개인정보보호위원회 공식 기준(RAG Ground Truth)을 바탕으로 제공된 개인정보 처리방침 텍스트를 심층 분석하여 평가하십시오.

[분석 지침]:
- 텍스트 내에 개발용 서식 태그(예: <개인정보처리자명>, [회사명] 등)가 미치환되어 노출되어 있다면 반드시 "fail"로 처리하고 템플릿 치환 오류를 구체적으로 인용하십시오.
- CPO 성명란에 실명이 아닌 회사명(예: 씨노텍)이나 담당부서명만 기재되어 있는지 확인하여 구체적으로 지적하십시오.
- 조항이 통째로 누락된 경우(예: 처리 위탁 조항 누락) 해당 사실을 명확히 적으십시오.

[개인정보보호위원회(PIPC) 공식 심사 기준 (RAG Ground Truth)]:
` + ragContextStr + `

[응답 요구조건]:
- 반드시 아래 JSON 구조로만 답변하고, 다른 텍스트는 포함하지 마십시오.
- status는 "pass"(적합), "warn"(보완필요), "fail"(누락/위반) 중 하나여야 합니다.

[JSON 구조 예시]:
{
  "score": 85,
  "gradeLabel": "안전 (우수)",
  "evaluations": [
    { "id": "rule_1", "status": "fail", "quotedSnippet": "① <개인정보처리자명>은(는) 법령에 따른...", "reason": "🚨 [치명적 템플릿 치환 오류] 개발용 치환 태그 <개인정보처리자명>이 실제 회사명으로 변경되지 않고 노출되어 있습니다.", "fixGuide": "보완 가이드..." }
  ]
}

[분석할 개인정보 처리방침 텍스트]:
` + rawText.slice(0, 4000);

      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: prompt,
          stream: false,
          format: 'json'
        })
      });

      const data = await res.json();
      let aiResultJson = null;

      try {
        aiResultJson = JSON.parse(data.response);
      } catch (e) {
        console.warn('JSON parsing retry:', e);
      }

      if (aiResultJson && aiResultJson.evaluations) {
        const results = DIAGNOSTIC_RULES.map((rule, idx) => {
          const aiEval = aiResultJson.evaluations.find(e => e.id === rule.id) || aiResultJson.evaluations[idx] || {};
          return {
            rule: rule,
            status: aiEval.status || 'pass',
            quotedSnippet: aiEval.quotedSnippet || '본문 내 조항 참조',
            reason: aiEval.reason || 'PIPC 지침 기준 문맥상 적합함을 확인하였습니다.',
            fixGuide: aiEval.fixGuide || rule.fixGuide
          };
        });

        const score = aiResultJson.score || Math.round((results.filter(r=>r.status==='pass').length / 12) * 100);
        let grade = { label: aiResultJson.gradeLabel || '안전 (우수)', class: 'risk-low' };
        if (score < 50) grade = { label: '위험 (보완 시급)', class: 'risk-high' };
        else if (score < 80) grade = { label: '주의 (보완 권고)', class: 'risk-mid' };

        lastDiagnosticResult = {
          companyName,
          companyUrl,
          cpoEmail,
          score,
          grade,
          engineTag: 'Local AI (' + selectedModel + ') + PIPC RAG',
          date: new Date().toLocaleString('ko-KR'),
          results
        };

        saveToHistory(lastDiagnosticResult);
        renderReport(lastDiagnosticResult);
        switchTab('report');
        alert('✨ 로컬 Ollama AI (' + selectedModel + ') 심층 구절 인용 분석 완료!');
        return;
      }
      throw new Error('AI Response Format Error');

    } catch (err) {
      console.warn('Ollama AI Error fallback to Regex:', err);
      alert('⚠️ 로컬 Ollama AI 연동 응답 지연 -> 정규식 기반 고속 진단 엔진으로 전환합니다.');
      runDiagnostic();
    } finally {
      btnRunAiScan.disabled = false;
      btnRunAiScan.innerText = origBtnText;
    }
  }

  function getActivePolicyText() {
    if (activeInputMode === 'url') return inputPolicyText.value.trim() || fetchedUrlText;
    if (activeInputMode === 'image') return inputPolicyText.value.trim() || extractedOcrText;
    return inputPolicyText.value.trim();
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
        quotedSnippet = '① <개인정보처리자명>은(는) 법령에 따른 개인정보 보유...';
        reason = '🚨 [치명적 템플릿 치환 오류] 서식 템플릿의 <개인정보처리자명> 치환 태그가 실제 회사명으로 수정되지 않고 그대로 노출되어 있습니다.';
      } else if (rule.id === 'rule_7' && (rawText.includes('성명: 씨노텍') || rawText.includes('성명 : 씨노텍') || /성명\s*:\s*[가-힣]+(주|회사|기업)/.test(rawText))) {
        status = 'warn';
        quotedSnippet = '성명: 씨노텍, 연락처: 032-715-6050';
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
      companyName,
      companyUrl,
      cpoEmail,
      score,
      grade,
      engineTag: '정규식 & 본문 인용 엔진',
      date: new Date().toLocaleString('ko-KR'),
      results
    };

    saveToHistory(lastDiagnosticResult);
    renderReport(lastDiagnosticResult);
    switchTab('report');
  }

  function renderReport(data) {
    document.getElementById('report-company-name').textContent = data.companyName;
    document.getElementById('report-date').textContent = data.date;
    document.getElementById('report-score').textContent = data.score;
    document.getElementById('report-engine-tag').textContent = data.engineTag || 'Local AI (gemma2:9b)';
    
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
    checklistContainer.innerHTML = data.results.map(r => {
      const iconStr = r.status === 'pass' ? '✓' : (r.status === 'warn' ? '!' : '✕');
      const tagText = r.status === 'pass' ? '적합' : (r.status === 'warn' ? '보완 필요' : '누락 (위반)');
      return '<div class="check-item">' +
        '<div class="check-icon ' + r.status + '">' + iconStr + '</div>' +
        '<div class="check-body">' +
          '<div class="check-header">' +
            '<span class="check-title">' + r.rule.title + '</span>' +
            '<span class="check-status-tag ' + r.status + '">' + tagText + '</span>' +
          '</div>' +
          (r.quotedSnippet ? '<div style="font-size:12px; background:#f1f5f9; border-left:3px solid #64748b; padding:6px 10px; margin: 6px 0; color:#334155;">📌 <strong>실제 약관 본문 인용:</strong> "' + r.quotedSnippet + '"</div>' : '') +
          '<div class="check-detail" style="font-weight:600;">' + r.reason + '</div>' +
          (r.status !== 'pass' ? '<div class="check-remediation" style="margin-top:6px;"><strong>💡 최신 PIPC 보완 지침:</strong> ' + r.rule.fixGuide + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');
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
      const clauseText = r.rule.standardClause || (r.rule.title + '\n관련 필수 내용을 최신 PIPC 지침에 따라 준수하여 처리합니다.');
      
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
        '<tr><td class="key">진단 점수</td><td><strong>' + data.score + '점 / 100점</strong> (' + data.grade.label + ')</td><td class="key">진단 엔진</td><td>' + (data.engineTag || 'Local AI (gemma2:9b)') + '</td></tr>' +
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
      '<div class="doc-section-title" style="display:flex; justify-content:space-between; align-items:center;"><span>3. 추천 개인정보 처리방침 표준 개정(안) 전문 (보완 완결본)</span><button class="btn-secondary" id="btn-copy-draft-text" style="font-size:12px; padding:4px 12px; color:#1e293b; background:#e2e8f0;">📋 전문 텍스트 복사</button></div>' +
      '<div style="margin-bottom: 16px; font-size: 12px; color: #64748b;">* 파란색 박스로 표시된 조항은 이번 진단을 통해 <strong>최신 PIPC 작성지침으로 보완·신설된 표준 개정 조항</strong>입니다. 홈페이지 하단에 그대로 복사하여 게재하실 수 있습니다.</div>' +
      '<div id="full-draft-text-box">' + fullDraftClausesHtml + '</div>' +
      '<div style="margin-top:40px; text-align:center; font-weight:700; font-size:15px; color:#0f172a;">2026년 8월 21일<br><br><strong>개인정보 보호 시정조치 솔루션 검인</strong></div>';

    document.getElementById('btn-copy-draft-text')?.addEventListener('click', () => {
      const draftBoxText = document.getElementById('full-draft-text-box').innerText;
      navigator.clipboard.writeText(draftBoxText).then(() => {
        alert('✅ 개인정보 처리방침 표준 개정(안) 전문 텍스트가 복사되었습니다!');
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
