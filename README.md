# DART 실시간 공시 모니터

관심 기업의 DART 공시를 실시간으로 모니터링하는 웹 대시보드입니다.

PC / iPad / iPhone 모든 디바이스에서 사용 가능합니다.

## 주요 기능

- 기업명 검색 및 관심 기업 관리
- 5분 간격 자동 갱신 (1분/3분/5분/10분 선택 가능)
- 공시 유형별 필터링 (정기공시, 주요사항보고 등)
- 새 공시 브라우저 알림 + 소리 알림
- 공시 클릭 시 DART 원문 페이지로 이동
- 반응형 다크 테마 UI

## 배포 방법 (Vercel)

### 1단계: GitHub 리포지토리 생성

```bash
cd dart-monitor
git init
git add .
git commit -m "DART 공시 모니터 초기 커밋"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dart-monitor.git
git push -u origin main
```

### 2단계: Vercel 연동

1. [vercel.com](https://vercel.com)에 GitHub 계정으로 로그인
2. **Add New → Project** 클릭
3. 방금 만든 `dart-monitor` 리포지토리 선택
4. **Deploy** 클릭 (기본 설정 그대로)

### 3단계: 환경변수 설정 (API 키 보안)

1. Vercel 프로젝트 대시보드 → **Settings** → **Environment Variables**
2. 아래 변수를 추가:

| Name | Value |
|------|-------|
| `DART_API_KEY` | `여기에_DART_API_키_입력` |

3. **Save** 후 **Deployments** → 최신 배포 우측 **⋯** → **Redeploy** 클릭

### 4단계: 완료!

배포된 URL (예: `https://dart-monitor.vercel.app`)을 공유하면
누구나 접속하여 실시간 공시를 확인할 수 있습니다.

## DART API 키 발급

1. [DART 오픈API](https://opendart.fss.or.kr) 접속
2. 회원가입 후 로그인
3. **인증키 신청** 메뉴에서 API 키 발급

## 프로젝트 구조

```
dart-monitor/
├── index.html          # 메인 대시보드 (프론트엔드)
├── api/
│   └── dart.js         # Vercel 서버리스 프록시 (API 키 보안)
├── vercel.json         # Vercel 설정
└── README.md           # 이 파일
```

## 작동 방식

- **Vercel 배포**: 서버리스 함수(`/api/dart`)가 DART API를 대신 호출합니다. API 키는 서버 환경변수에만 저장되어 클라이언트에 노출되지 않습니다.
- **로컬 실행**: `dart_server.py`로 로컬 프록시 서버를 실행하거나, 설정에서 API 키를 직접 입력할 수 있습니다.

## 로컬에서 테스트

```bash
# Python 로컬 서버로 실행 (CORS 해결)
python dart_server.py

# 또는 Vercel CLI로 실행
npx vercel dev
```
