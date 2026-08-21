// ============================================================
// 중소기업 개인정보 처리방침 진단 & 보완조치 요청 솔루션
// Compliance Diagnostics & Remediation Request Engine
// ============================================================

(function () {
  'use strict';

  // ── 10대 법적 필수 진단 항목 (개인정보 보호법 제30조 준수)
  const DIAGNOSTIC_RULES = [
    {
      id: 'rule_1',
      title: '1. 개인정보의 수집·이용 목적 및 항목',
      desc: '처리하는 개인정보의 항목과 수집 목적이 구체적으로 명시되어야 합니다.',
      keywords: ['목적', '수집', '항목'],
      subKeywords: ['이름', '이메일', '연락처', '전화번호', '주소', '서비스'],
      fixGuide: '수집하는 필수/선택 항목을 구체적으로 구분하고, 회원가입·서비스 이행 등 개별 목적을 명확히 작성하세요.'
    },
    {
      id: 'rule_2',
      title: '2. 개인정보의 보유 및 이용 기간',
      desc: '원칙적 파기 시점 및 전자상거래법 등 관계 법령에 따른 보존 기간이 기재되어야 합니다.',
      keywords: ['보유', '이용기간', '보존기간'],
      subKeywords: ['법령', '상법', '전자상거래', '파기'],
      fixGuide: '원칙적 보유 기간(회원 탈퇴 시 등)과 관련 법령(전자상거래법 5년 등)에 의한 보존 기간을 명시하세요.'
    },
    {
      id: 'rule_3',
      title: '3. 개인정보의 제3자 제공에 관한 사항',
      desc: '제3자 제공 여부, 제공받는 자, 목적, 항목, 보유기간이 명시되어야 합니다.',
      keywords: ['제3자', '제공'],
      subKeywords: ['동의', '제공받는', '제공하지 않습니다', '별도 동의'],
      fixGuide: '제3자 제공이 없을 경우 "원칙적으로 제3자에게 제공하지 않습니다"를 명시하고, 제공 시 별도 동의 절차와 항목을 기재하세요.'
    },
    {
      id: 'rule_4',
      title: '4. 개인정보 처리 위탁 내용 및 수탁자',
      desc: '외주/위탁 업무 내용과 수탁업체 사명이 기재되어야 합니다.',
      keywords: ['위탁', '수탁자'],
      subKeywords: ['수탁', '위탁업체', '위탁하지 않습니다', '택배', 'PG'],
      fixGuide: '결제, 배송, IT 인프라 등 개인정보 처리를 위탁받는 업체명과 위탁 업무 범위를 명시하세요.'
    },
    {
      id: 'rule_5',
      title: '5. 개인정보의 파기 절차 및 방법',
      desc: '전자적 파일의 영구 삭제 방법 및 종이 출력물 파기 방법이 명시되어야 합니다.',
      keywords: ['파기절차', '파기방법', '파기'],
      subKeywords: ['전자적', '영구', '삭제', '분쇄', '소각'],
      fixGuide: '전자적 파일(복구 불가능한 기술적 삭제)과 서면 출력물(분쇄/소각)의 구체적 파기 방식을 명시하세요.'
    },
    {
      id: 'rule_6',
      title: '6. 정보주체와 법정대리인의 권리·의무 및 행사방법',
      desc: '열람·정정·삭제·처리정지 요구권 및 행사 방법이 기재되어야 합니다.',
      keywords: ['권리', '열람', '정정', '삭제', '처리정지'],
      subKeywords: ['행사', '법정대리인', '요구', '서면'],
      fixGuide: '정보주체 및 14세 미만 아동의 법정대리인이 권리를 행사할 수 있는 절차(서면, 이메일 등)를 기술하세요.'
    },
    {
      id: 'rule_7',
      title: '7. 개인정보 보호책임자(CPO) 성명 및 연락처',
      desc: '개인정보 보호책임자의 성명(또는 부서명), 직책, 연락처, 이메일이 반드시 포함되어야 합니다.',
      keywords: ['보호책임자', 'CPO'],
      subKeywords: ['성명', '이름', '연락처', '전화번호', '이메일', '부서'],
      fixGuide: '개인정보 보호책임자의 실명(또는 담당 부서명), 직책, 전화번호, 이메일 주소를 누락 없이 기재하세요.'
    },
    {
      id: 'rule_8',
      title: '8. 개인정보의 안전성 확보 조치',
      desc: '기술적, 관리적, 물리적 보안 대책(암호화, 접근통제 등)이 작성되어야 합니다.',
      keywords: ['안전성', '보안', '안전성 확보'],
      subKeywords: ['기술적', '관리적', '암호화', '접근권한', '백신'],
      fixGuide: '비밀번호 암호화, 백신 프로그램 설치, 접근 권한 최소화 등 안전성 확보를 위한 3대 대책을 서술하세요.'
    },
    {
      id: 'rule_9',
      title: '9. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부',
      desc: '쿠키의 사용 목적 및 웹브라우저 설정 통한 쿠키 거부 방법이 안내되어야 합니다.',
      keywords: ['쿠키', 'cookie', '자동 수집'],
      subKeywords: ['설치', '운영', '거부', '설정', '웹브라우저'],
      fixGuide: '쿠키 수집 목적을 설명하고, 브라우저(Chrome, Edge 등) 옵션에서 쿠키 차단 설정 경로를 명시하세요.'
    },
    {
      id: 'rule_10',
      title: '10. 권익침해 구제방법 및 기관 연락처',
      desc: '개인정보분쟁조정위원회, 대검찰청, 경찰청 등 분쟁 해결 전문기관 안내가 명시되어야 합니다.',
      keywords: ['구제', '분쟁', '권익'],
      subKeywords: ['개인정보분쟁조정위원회', '118', '경찰청', '대검찰청', '상담'],
      fixGuide: '개인정보 침해 신고 센터(118), 개인정보 분쟁조정위원회(1833-6972) 등의 기관명과 연락처를 기재하세요.'
    }
  ];

  // ── 샘플 데이터 (중소기업 처리방침 예시)
  const SAMPLE_POLICIES = {
    sample_bad: {
      companyName: '(주)에이비씨 쇼핑몰',
      url: 'https://www.abc-sample-mall.co.kr',
      cpo: '미지정 (담당자 누락)',
      email: 'contact@abc-sample-mall.co.kr',
      text: `[개인정보 처리방침]

1. 수집하는 개인정보 항목
회사는 회원가입 시 이름, 이메일, 전화번호를 수집합니다.

2. 개인정보의 이용목적
회원 관리 및 상품 배송 목적으로 이용합니다.

3. 개인정보의 보유기간
회원 탈퇴 시까지 보유합니다.

4. 개인정보의 파기
목적이 달성된 개인정보는 지체없이 파기합니다.

5. 고객센터
이메일: contact@abc-sample-mall.co.kr`
    },
    sample_mid: {
      companyName: '(주)XYZ 핀테크 스타트업',
      url: 'https://xyz-startup.io',
      cpo: '김철수 팀장',
      email: 'privacy@xyz-startup.io',
      text: `(주)XYZ 핀테크 개인정보 처리방침

1. 수집하는 개인정보 항목 및 목적
회사는 회원가입 및 서비스 제공을 위해 아래 정보를 수집합니다.
- 항목: 성명, 이메일, 휴대전화번호, 비밀번호
- 목적: 본인확인, 서비스 이용안내, 공지사항 전달

2. 개인정보 보유 및 이용기간
- 회원 탈퇴 시 즉시 파기합니다.
- 단, 관련 법령(전자상거래법)에 의해 5년간 보존합니다.

3. 개인정보 제3자 제공 및 위탁
- 회사는 제3자 제공을 하지 않습니다.
- 데이터 보관을 위해 AWS Cloud에 위탁 관리합니다.

4. 정보주체의 권리
이용자는 언제든지 본인의 개인정보 열람 및 정정을 요구할 수 있습니다.

5. 개인정보 보호책임자
성명: 김철수
연락처: privacy@xyz-startup.io`
    },
    sample_good: {
      companyName: '(주)한국보안기술',
      url: 'https://www.korea-sec-tech.co.kr',
      cpo: '박민수 이사 (보안기획실)',
      email: 'cpo@korea-sec-tech.co.kr',
      text: `(주)한국보안기술 개인정보 처리방침 (v2.1)

1. 개인정보의 수집·이용 목적 및 항목
회사는 서비스 제공을 위해 성명, 이메일, 연락처, 회사명을 수집하며, 회원 관리 및 고객 문의 대응 목적으로 이용합니다.

2. 개인정보의 보유 및 이용 기간
이용자의 개인정보는 수집 및 이용목적이 달성되면 지체 없이 파기합니다. 단, 전자상거래법에 따라 계약/청약철회 기록은 5년 보존합니다.

3. 개인정보의 제3자 제공
회사는 원칙적으로 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.

4. 개인정보 처리 위탁 내용 및 수탁자
회사는 원활한 서비스 제공을 위해 PG결제(NICE페이먼츠), 택배배송(CJ대한통운)에 위탁하고 있습니다.

5. 개인정보의 파기 절차 및 방법
전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 영구 파기하며, 종이 출력물은 분쇄기로 분쇄합니다.

6. 정보주체와 법정대리인의 권리·의무 및 행사방법
정보주체 및 14세 미만 아동의 법정대리인은 언제든지 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.

7. 개인정보 보호책임자(CPO) 성명 및 연락처
- 성명: 박민수 이사 (보안기획실)
- 전화번호: 02-1234-5678
- 이메일: cpo@korea-sec-tech.co.kr

8. 개인정보의 안전성 확보 조치
회사는 비밀번호 암호화 저장, 백신 프로그램 설치, 접근 권한의 관리 등 기술적·관리적 안전성 확보 조치를 취하고 있습니다.

9. 개인정보 자동 수집 장치(쿠키)의 설치·운영 및 거부
회사는 맞춤형 서비스 제공을 위해 쿠키를 사용하며, 웹브라우저 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.

10. 권익침해 구제방법
개인정보 침해 관련 상담은 개인정보분쟁조정위원회(1833-6972) 또는 개인정보침해신고센터(118)로 문의하실 수 있습니다.`
    }
  };

  // ── 애플리케이션 상태
  let lastDiagnosticResult = null;
  let historyLogs = JSON.parse(localStorage.getItem('privacy_diag_history') || '[]');

  // ── DOM 요소 참조
  let inputCompanyName, inputCompanyUrl, inputCpoEmail, inputPolicyText, btnRunScan;
  let panelScan, panelReport, panelRequestDoc, panelHistory;
  let navScanBtn, navReportBtn, navDocBtn, navHistoryBtn;

  // ── 초기화
  document.addEventListener('DOMContentLoaded', () => {
    inputCompanyName = document.getElementById('input-company-name');
    inputCompanyUrl  = document.getElementById('input-company-url');
    inputCpoEmail    = document.getElementById('input-cpo-email');
    inputPolicyText  = document.getElementById('input-policy-text');
    btnRunScan       = document.getElementById('btn-run-scan');
    
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
  });

  function bindEvents() {
    // 탭 전환
    navScanBtn.addEventListener('click', () => switchTab('scan'));
    navReportBtn.addEventListener('click', () => switchTab('report'));
    navDocBtn.addEventListener('click', () => switchTab('doc'));
    navHistoryBtn.addEventListener('click', () => switchTab('history'));

    // Preset 버튼 클릭
    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.target.dataset.preset;
        if (SAMPLE_POLICIES[key]) {
          loadPreset(SAMPLE_POLICIES[key]);
        }
      });
    });

    // 진단 실행 버튼
    btnRunScan.addEventListener('click', runDiagnostic);

    // 보완조치 요청서 생성 버튼
    document.getElementById('btn-generate-doc')?.addEventListener('click', () => {
      if (!lastDiagnosticResult) {
        alert('먼저 개인정보 처리방침 진단을 실행해주세요.');
        return;
      }
      buildRemediationDocument(lastDiagnosticResult);
      switchTab('doc');
    });

    // 복사 & 다운로드 버튼
    document.getElementById('btn-copy-doc')?.addEventListener('click', copyDocToClipboard);
    document.getElementById('btn-print-doc')?.addEventListener('click', () => window.print());
    document.getElementById('btn-email-doc')?.addEventListener('click', sendEmailDraft);
  }

  function switchTab(tabId) {
    [panelScan, panelReport, panelRequestDoc, panelHistory].forEach(p => p.classList.remove('active'));
    [navScanBtn, navReportBtn, navDocBtn, navHistoryBtn].forEach(b => b.classList.remove('active'));

    if (tabId === 'scan') {
      panelScan.classList.add('active');
      navScanBtn.classList.add('active');
    } else if (tabId === 'report') {
      panelReport.classList.add('active');
      navReportBtn.classList.add('active');
    } else if (tabId === 'doc') {
      panelRequestDoc.classList.add('active');
      navDocBtn.classList.add('active');
    } else if (tabId === 'history') {
      panelHistory.classList.add('active');
      navHistoryBtn.classList.add('active');
    }
  }

  function loadPreset(sample) {
    inputCompanyName.value = sample.companyName;
    inputCompanyUrl.value  = sample.url;
    inputCpoEmail.value    = sample.email;
    inputPolicyText.value  = sample.text;
  }

  // ── 진단 실행 엔진 (Diagnostic Engine)
  function runDiagnostic() {
    const text = inputPolicyText.value.trim();
    const companyName = inputCompanyName.value.trim() || '미지정 기업';
    const companyUrl  = inputCompanyUrl.value.trim()  || '-';
    const cpoEmail    = inputCpoEmail.value.trim()    || '-';

    if (!text) {
      alert('진단할 개인정보 처리방침 텍스트를 입력해주세요.');
      return;
    }

    const results = [];
    let passCount = 0;

    DIAGNOSTIC_RULES.forEach(rule => {
      const hasMainKw = rule.keywords.some(kw => text.includes(kw));
      const hasSubKw  = rule.subKeywords.some(kw => text.includes(kw));
      
      let status = 'fail';
      let reason = '';

      if (hasMainKw && hasSubKw) {
        status = 'pass';
        reason = '법적 필수 사항이 명확하게 기재되어 있습니다.';
        passCount++;
      } else if (hasMainKw || hasSubKw) {
        status = 'warn';
        reason = '일부 조항이 기술되어 있으나, 구체적인 세부 내용이 모호하거나 누락되었습니다.';
      } else {
        status = 'fail';
        reason = '해당 필수 항목 및 연관 조항이 완전히 누락되어 법적 위반 위험이 높습니다.';
      }

      results.push({
        rule: rule,
        status: status,
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
      date: new Date().toLocaleString('ko-KR'),
      results
    };

    // 이력 저장
    saveToHistory(lastDiagnosticResult);

    // 리포트 UI 렌더링
    renderReport(lastDiagnosticResult);
    switchTab('report');
  }

  // ── 진단 리포트 UI 렌더링
  function renderReport(data) {
    document.getElementById('report-company-name').textContent = data.companyName;
    document.getElementById('report-date').textContent = data.date;
    document.getElementById('report-score').textContent = data.score;
    
    const gradeBadge = document.getElementById('report-grade-badge');
    gradeBadge.textContent = data.grade.label;
    gradeBadge.className = `grade-badge ${data.grade.class}`;

    // 프로그레스 서클 애니메이션
    const circleVal = document.getElementById('score-circle-val');
    if (circleVal) {
      const offset = 440 - (440 * data.score) / 100;
      circleVal.style.strokeDashoffset = offset;
      circleVal.style.stroke = data.score >= 80 ? '#10b981' : (data.score >= 50 ? '#f59e0b' : '#ef4444');
    }

    // 체크리스트 리스트 생성
    const checklistContainer = document.getElementById('report-checklist');
    checklistContainer.innerHTML = data.results.map(r => {
      const iconStr = r.status === 'pass' ? '✓' : (r.status === 'warn' ? '!' : '✕');
      const tagText = r.status === 'pass' ? '적합' : (r.status === 'warn' ? '보완 필요' : '누락 (위반)');
      return `
        <div class="check-item">
          <div class="check-icon ${r.status}">${iconStr}</div>
          <div class="check-body">
            <div class="check-header">
              <span class="check-title">${r.rule.title}</span>
              <span class="check-status-tag ${r.status}">${tagText}</span>
            </div>
            <div class="check-detail">${r.reason}</div>
            ${r.status !== 'pass' ? `
              <div class="check-remediation">
                <strong>💡 보완 가이드:</strong> ${r.rule.fixGuide}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // ── 보완조치 요청서 공문 생성기 (Formal Remediation Document Generator)
  function buildRemediationDocument(data) {
    const docContainer = document.getElementById('doc-paper-content');
    const failedItems = data.results.filter(r => r.status !== 'pass');

    const tableRowsHtml = failedItems.map((item, idx) => `
      <tr>
        <td style="text-align:center; font-weight:700;">${idx + 1}</td>
        <td><strong>${item.rule.title}</strong></td>
        <td><span class="doc-badge-fail">${item.status === 'fail' ? '필수 항목 누락' : '내용 미비/모호'}</span></td>
        <td>${item.rule.fixGuide}</td>
      </tr>
    `).join('');

    docContainer.innerHTML = `
      <h1>개인정보 처리방침 보완조치 요청서</h1>
      
      <table class="doc-meta-table">
        <tr>
          <td class="key">수 신 자</td>
          <td>${data.companyName} 대표이사 및 개인정보 보호책임자(CPO)</td>
          <td class="key">발 신 자</td>
          <td>개인정보 보호 진단/시정조치 솔루션팀</td>
        </tr>
        <tr>
          <td class="key">기업 URL</td>
          <td>${data.companyUrl}</td>
          <td class="key">진단 일자</td>
          <td>${data.date}</td>
        </tr>
        <tr>
          <td class="key">진단 점수</td>
          <td><strong>${data.score}점 / 100점</strong> (${data.grade.label})</td>
          <td class="key">수신 이메일</td>
          <td>${data.cpoEmail}</td>
        </tr>
      </table>

      <p>귀사의 일익 번창하심을 기원합니다.</p>
      <p style="margin-top:8px;">
        「개인정보 보호법」 제30조(개인정보 처리방침의 수립 및 공개)에 의거하여 귀사의 개인정보 처리방침에 대한 컴플라이언스 진단을 실시한 결과, 
        아래와 같이 <strong>법적 필수 항목 누락 및 미비 사항이 확인되어 개선 및 보완조치를 요청</strong> 드립니다.
      </p>

      <div class="doc-section-title">1. 시정 및 보완조치 요청 항목 (${failedItems.length}건)</div>
      
      ${failedItems.length > 0 ? `
        <table class="doc-table">
          <thead>
            <tr>
              <th style="width:40px;">No</th>
              <th style="width:200px;">진단 항목</th>
              <th style="width:120px;">진단 결과</th>
              <th>권고 보완 조치 사항</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      ` : `
        <p style="padding:16px; background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; border-radius:6px;">
          ✅ 축하합니다! 법적 필수 항목 누락 사항이 발견되지 않았습니다.
        </p>
      `}

      <div class="doc-section-title">2. 요청 및 이행 기한</div>
      <p>
        개인정보 보호법 위반 시 시정명령 및 과태료 부과 대상이 될 수 있으므로, 
        본 요청서를 수신한 날로부터 <strong>14일 이내</strong>에 개정된 개인정보 처리방침을 홈페이지에 공고하여 주시기 바랍니다.
      </p>

      <div class="doc-section-title">3. 표준 개정(안) 가이드 서식</div>
      <div style="background:#f8fafc; border:1px dashed #cbd5e1; padding:16px; border-radius:6px; font-size:12px; color:#475569;">
        * 첨부된 보완조치 가이드를 참고하여 약관 개정 후 홈페이지 하단에 "개인정보 처리방침" 링크를 등록해 주시기 바랍니다.
      </div>

      <div style="margin-top:40px; text-align:center; font-weight:700; font-size:15px; color:#0f172a;">
        2026년 8월 21일<br><br>
        <strong>개인정보 보호 시정조치 솔루션 검인</strong>
      </div>
    `;
  }

  // ── 복사 & 이메일 드래프트 생성
  function copyDocToClipboard() {
    const docText = document.getElementById('doc-paper-content').innerText;
    navigator.clipboard.writeText(docText).then(() => {
      alert('보완조치 요청서 텍스트가 클립보드에 복사되었습니다.');
    });
  }

  function sendEmailDraft() {
    if (!lastDiagnosticResult) return;
    const mailto = lastDiagnosticResult.cpoEmail !== '-' ? lastDiagnosticResult.cpoEmail : '';
    const subject = encodeURIComponent(`[보완조치 요청] ${lastDiagnosticResult.companyName} 개인정보 처리방침 진단 결과 및 시정 요청`);
    const bodyText = encodeURIComponent(`안녕하세요, ${lastDiagnosticResult.companyName} 개인정보 보호책임자님.\n\n개인정보 보호법 제30조에 의거하여 귀사의 개인정보 처리방침을 진단한 결과, 총 ${lastDiagnosticResult.results.filter(r=>r.status!=='pass').length}건의 법적 필수 항목 미비 사항이 확인되었습니다.\n\n[진단 점수]: ${lastDiagnosticResult.score}점 (${lastDiagnosticResult.grade.label})\n\n자세한 보완조치 요청 내용은 첨부된 공문서를 확인해 주시고, 14일 이내에 개정 완료해 주시기를 바랍니다.\n\n감사합니다.`);
    
    window.open(`mailto:${mailto}?subject=${subject}&body=${bodyText}`, '_blank');
  }

  // ── 진단 이력 관리 (LocalStorage)
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
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:32px;">진단 이력이 없습니다. 메인 메뉴에서 진단을 실행해주세요.</td></tr>`;
      return;
    }

    tbody.innerHTML = historyLogs.map(log => `
      <tr>
        <td><strong>${log.companyName}</strong></td>
        <td><a href="${log.url}" target="_blank" style="color:var(--primary);">${log.url}</a></td>
        <td><span style="font-weight:700; color:${log.score>=80?'#10b981':(log.score>=50?'#f59e0b':'#ef4444')}">${log.score}점</span></td>
        <td>${log.gradeLabel}</td>
        <td>${log.date}</td>
      </tr>
    `).join('');
  }

})();
