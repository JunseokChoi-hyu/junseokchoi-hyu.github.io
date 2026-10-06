// 아카이브 자료 목록. 새 자료는 해당 배열에 객체 하나만 추가하면 카드가 자동으로 생긴다.
// file/thumb 경로는 공백⁠·⁠한글 그대로 적어도 된다 (렌더링 시 인코딩).
window.ARCHIVE = {
  research: [
    {
      step: 1,
      name: 'CADGenBench 베이스라인',
      short: 'STEP 형상 생성 확인',
      title: 'CADGenBench 베이스라인 실행',
      summary: 'CADGenBench baseline을 실행해 STEP 형상을 생성하고 결과를 확인했습니다.',
      tags: ['Evaluation', 'FreeCAD'],
      file: 'assets/pdfs/Text2CAD_STEP 1.pdf',
      thumb: 'assets/thumbnails/text2cad-step01.png',
      alt: 'CADGenBench baseline STEP 생성 성공 및 형상 유효성 결과'
    },
    {
      step: 2,
      name: 'FreeCAD 자동 생성',
      short: 'Local LLM으로 FreeCAD 형상 생성',
      title: 'Local LLM 기반 FreeCAD 형상 생성',
      summary: 'Local LLM으로 FreeCAD 형상을 생성하고 실행 과정을 정리했습니다.',
      tags: ['Local LLM', 'FreeCAD'],
      file: 'assets/pdfs/Text2CAD_STEP 2.pdf',
      thumb: 'assets/thumbnails/text2cad-step02.png',
      alt: 'Local LLM으로 생성한 비틀림 날개 FreeCAD 결과'
    },
    {
      step: 3,
      name: 'LLM⁠·⁠프로그램 역할 분리',
      short: '해석은 LLM, 계산은 프로그램',
      title: 'LLM과 프로그램의 역할 분리',
      summary: 'LLM은 자연어 해석만 맡고 계산⁠·⁠코드 생성⁠·⁠검증은 프로그램이 담당하도록 구조를 분리한 과정을 정리했습니다.',
      tags: ['Pipeline', 'FreeCAD'],
      file: 'assets/pdfs/Text2CAD_STEP 3.pdf',
      thumb: 'assets/thumbnails/text2cad-step03.png',
      alt: '자연어 요청부터 스키마 검증, FreeCAD 실행, STEP 내보내기까지 이어지는 Text2CAD 최종 프로그램 구조 흐름도'
    },
    {
      step: 4,
      name: 'RAG 기반 CAD 생성',
      short: 'RAG로 생성 구조 확장',
      title: 'RAG 기반 CAD 생성과 항공기 형상',
      summary: 'Local LLM과 RAG를 활용한 CAD 생성 구조와 항공기 형상 연구 진행 내용을 정리했습니다.',
      tags: ['Local LLM', 'RAG', 'Aircraft'],
      file: 'assets/pdfs/Text2CAD_STEP 4.pdf',
      thumb: 'assets/thumbnails/text2cad-step04.png',
      alt: 'Text2CAD STEP 4 연구 자료 대표 페이지'
    },
    {
      step: 5,
      name: 'Agent⁠·⁠Skill⁠·⁠RAG 실험',
      short: 'Agent 구조와 Skill 적용',
      title: 'Agent 구조와 Skill⁠·⁠RAG 실험',
      summary: 'Agent 구조와 Skill⁠·⁠RAG 적용 실험을 정리했습니다.',
      tags: ['Agent', 'RAG'],
      file: 'assets/pdfs/Text2CAD_STEP 5.pdf',
      thumb: 'assets/thumbnails/text2cad-step05.png',
      alt: 'Text2CAD STEP 5 연구 자료 대표 페이지'
    },
    {
      step: 6,
      name: '형상 비교 지표',
      short: 'IoU⁠·⁠Chamfer로 정량 비교',
      title: '파이프라인 개선과 형상 비교 지표',
      summary: '생성 파이프라인을 개선하고 IoU⁠·⁠Chamfer를 활용한 형상 비교 방법을 정리했습니다.',
      tags: ['Pipeline', 'Evaluation'],
      file: 'assets/pdfs/Text2CAD_STEP 6.pdf',
      thumb: 'assets/thumbnails/text2cad-step06.png',
      alt: 'Text2CAD STEP 6 연구 자료 대표 페이지'
    },
    {
      step: 7,
      name: 'LLM → OpenVSP 구조',
      short: 'OpenVSP 생성과 RAG 검색',
      title: 'LLM → OpenVSP 생성 구조',
      summary: 'LLM에서 OpenVSP로 이어지는 생성 구조와 RAG 검색 방법을 정리했습니다.',
      tags: ['OpenVSP', 'RAG', 'Aircraft'],
      file: 'assets/pdfs/Text2CAD_STEP 7.pdf',
      thumb: 'assets/thumbnails/text2cad-step07.png',
      alt: 'Text2CAD STEP 7 연구 자료 대표 페이지'
    },
    {
      step: 8,
      name: '형상 계획 실패 분석',
      short: '정답지 일치율 53% → 75%',
      title: '형상 계획 단계 실패 원인 분석',
      summary: 'gpt-oss의 형상 계획문 작성 능력을 정답지와 비교하고, 기본 틀 제공과 한/영 요청에 따른 차이를 분석했습니다.',
      tags: ['Local LLM', 'Evaluation', 'OpenVSP'],
      file: 'assets/pdfs/Text2CAD_STEP 8.pdf',
      thumb: 'assets/thumbnails/text2cad-step08.png',
      alt: '형상 계획문 기본 틀 유무에 따른 정답지 일치율 비교표'
    },
    {
      step: 9,
      name: '코드 생성 단계 통과',
      short: '코드 단계 통과 ⁠·⁠ 형상 단계 진행 중',
      title: 'Code generation 단계와 Enumeration RAG',
      summary: 'Code generation 단계 통과 여부를 확인하고, OpenVSP Enumeration 정보를 RAG 청크로 보완해 문제를 해결했습니다.',
      tags: ['OpenVSP', 'RAG', 'Agent'],
      file: 'assets/pdfs/Text2CAD_STEP 9.pdf',
      thumb: 'assets/thumbnails/text2cad-step09.png',
      alt: '진행 현황: 코드 생성 단계 통과, 형상 계획 단계 진행 중'
    },
    {
      step: 10,
      name: '전체 파이프라인 검증',
      short: '부품 제거⁠·⁠치수 변경 확인',
      title: 'JSON 단계 완료와 전체 파이프라인 검증',
      summary: 'JSON 작성 단계를 마무리하고 전체 파이프라인에서 부품 제거⁠·⁠치수 변경을 재확인했으며, Qwen3.5:9B 적용과 자유도 테스트를 진행했습니다.',
      tags: ['Pipeline', 'OpenVSP', 'Local LLM'],
      file: 'assets/pdfs/Text2CAD_STEP 10.pdf',
      thumb: 'assets/thumbnails/text2cad-step10.png',
      alt: 'JSON 작성 단계의 완전한 항공기 형상 기준 3면도'
    }
  ],
  study: [
    {
      label: 'NOTE',
      title: 'ANN 코드 학습 노트',
      summary: 'Weight, Bias와 활성화 함수의 역할을 그림과 함께 정리한 학습 노트입니다.',
      tags: ['ANN'],
      file: 'assets/study/ANN 코드 학습 노트.pdf',
      thumb: 'assets/thumbnails/ann-study.png',
      alt: 'Weight, Bias와 활성화 함수를 정리한 ANN 필기',
      note: true
    },
    {
      label: 'CHAP 05',
      title: '합성곱 신경망 (CNN)',
      summary: 'ResNet18 기반 분류 실습과 예측 결과, 특성 맵 분석을 정리했습니다.',
      tags: ['CNN'],
      file: 'assets/study/Chap 05 스터디 자료.pdf',
      thumb: 'assets/thumbnails/chapter-05.png',
      alt: 'Chap 05 합성곱 신경망 스터디 발표 표지'
    },
    {
      label: 'CHAP 07',
      title: '시계열 분석 (RNN)',
      summary: '시계열 데이터를 다루는 순환 신경망의 구조와 차이를 정리했습니다.',
      tags: ['RNN'],
      file: 'assets/study/Chap 07 스터디 자료.pdf',
      thumb: 'assets/thumbnails/chapter-07.png',
      alt: 'Chap 07 시계열 분석 스터디 발표 표지'
    },
    {
      label: 'CHAP 07 · CODE',
      title: '시계열 분석 — 코드 중심',
      summary: '순환 신경망의 핵심 구조를 실제 구현 코드 중심으로 정리했습니다.',
      tags: ['RNN'],
      file: 'assets/study/Chap 07 스터디 자료 (코드 중심).pdf',
      thumb: 'assets/thumbnails/chapter-07-code.png',
      alt: '7장 시계열분석 코드 중심 발표 표지'
    },
    {
      label: 'CHAP 08',
      title: '성능 최적화',
      summary: '데이터⁠·⁠알고리즘⁠·⁠하드웨어와 배치 정규화, 드롭아웃 등 성능 최적화 방법을 정리했습니다.',
      tags: ['Optimization'],
      file: 'assets/study/Chap 08 스터디 자료.pdf',
      thumb: 'assets/thumbnails/chapter-08.png',
      alt: 'Chap 08 성능 최적화 스터디 발표 표지'
    }
  ],
  // 연구 단계 묶음 (Research·Archive 페이지 공통). 새 STEP은 마지막 Phase에 자동으로 들어간다.
  phases: [
    { label: 'PHASE 1', title: 'FreeCAD 기반 생성', from: 1, to: 3, img: 'assets/thumbnails/phase-1.png', imgAlt: 'Local LLM이 FreeCAD로 생성한 비틀림 날개',
      summary: '자연어로 FreeCAD 형상을 만드는 기본 흐름 구축' },
    { label: 'PHASE 2', title: 'RAG · Agent 구조 설계', from: 4, to: 7, img: 'assets/thumbnails/phase-2.png', imgAlt: 'RAG 구조: 질문, 벡터 DB, 답변',
      summary: 'RAG⁠·⁠멀티 에이전트 도입, OpenVSP로 확장' },
    { label: 'PHASE 3', title: 'OpenVSP 파이프라인 검증', from: 8, to: 9999, img: 'assets/thumbnails/phase-3.png', imgAlt: 'OpenVSP로 생성하고 검증한 항공기 형상',
      summary: 'gpt-oss:20b 기반 전체 파이프라인 검증 중' }
  ]
};
