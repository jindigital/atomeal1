# 🌿 맑은 식단 기록장 (Clear Diet Diary)

아토피 피부와 약한 소화기를 위해 매일의 식단을 기록하고 점검할 수 있도록 돕는 웹 애플리케이션입니다. 밝고 따뜻한 파스텔톤 UI를 통해 식단 관리에 지치지 않고 긍정적인 마음으로 건강한 식습관을 유지할 수 있도록 기획되었습니다.

## 💡 주요 기능 (Features)

*   **간편한 식단 기록:** 오늘 먹은 음식(전통 음식, 천연 식재료 등)을 텍스트로 자유롭게 입력하고 저장합니다.
*   **스마트 식단 분석 (키워드 매칭):** 
    *   입력된 텍스트를 분석하여 피부와 소화기에 부담을 줄 수 있는 3대 주의 성분(**밀가루, 단 음식, 기름진 음식**)을 감지합니다.
    *   주의 성분이 포함될 경우, 따뜻한 조언이 담긴 경고 메시지를 출력합니다.
    *   자연 식재료 위주의 건강한 식단일 경우, 칭찬 메시지를 통해 동기를 부여합니다.
*   **클라우드 데이터 저장:** Firebase를 활용하여 입력한 식단 기록이 안전하게 누적 및 보관됩니다.

## 🛠 기술 스택 (Tech Stack)

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Backend & DB:** Firebase (Realtime Database / Firestore)
*   **Deployment:** Vercel
*   **Analysis Logic:** 외부 API에 의존하지 않는 자체 키워드 매칭 알고리즘 구현 (비용 0원)

## 🚀 배포 및 실행 방법 (Getting Started)

1. **저장소 클론 (Clone)**
   ```bash
   git clone [https://github.com/사용자이름/레포지토리이름.git](https://github.com/사용자이름/레포지토리이름.git)