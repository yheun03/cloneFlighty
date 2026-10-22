# Flighty 웹 퍼블리싱

이 프로젝트는 Vue · SCSS 퍼블리싱 프로젝트입니다. 항공편 목록·상세·패스포트는 제공된 Flighty CSV 30편(2026-10-22 기준 지난 여정 26편, 앞으로의 여정 4편)을 공통 임시 JSON으로 연결해 사용합니다. 실제 시각·기체 정보가 없는 항목은 미정으로 구분하며 거리는 공항 좌표의 대권거리 추정값입니다.

- 항공편·항공사·공항 데이터는 `src/data/temp/`의 JSON에서 수정합니다. 목록·상세·패스포트·항공편 통계·검색이 같은 데이터를 참조합니다. 기체 상세 정보는 등록번호로 adsbdb 공개 API에서 조회하고 `src/common/aircraft.js`에서 화면 세션 동안 재사용합니다. 그 외 화면 문구와 독립적인 예시는 각 페이지의 `pageData`에서 관리합니다.
- 공통 컴포넌트는 페이지에서 전달한 데이터를 표시하며, 자체 항공편·통계·친구 샘플 데이터를 갖지 않습니다.
- `src/common/airlines.js`, `airports.js`는 JSON과 에셋을 연결하고, `flights.js`는 항공편별 표시 시간·지연·시차를 계산합니다. 앞으로의 여정 지도는 현재 항공편 목록을, 패스포트 지도는 선택한 기간의 지난 여정을 표시합니다. 검색·기간 변경 시 지도도 함께 갱신되며 상세 지도는 해당 항공편 하나를 표시합니다. 지도 배경은 기존 MapLibre와 OpenFreeMap을 사용합니다.
- 예약 편집은 선택한 항공편의 상태를 갱신하며 페이지 이동 후에도 유지합니다. 항공사 전화·공식 홈페이지·SNS는 JSON의 실제 링크를 사용합니다. 공유·초대·삭제는 미리보기 안내만 표시합니다.
- 화면 상태는 새로고침하면 초기화됩니다. 기체 정보는 외부 API에서 조회하며, 예약 편집·공유·초대는 로컬 미리보기입니다.
- 변경 전 유사한 Vue 파일을 확인하고 기존 마크업, 클래스명, SCSS, 공통 컴포넌트 사용 방식을 따릅니다.

공통 UI는 `src/component/base/`, 플라이티 전용 조합은 `src/component/fc/`에서 관리합니다. 같은 기능은 별도 파일 대신 `type`, `variant`, `size` 등의 props로 구분합니다. 검색 결과와 설정 목록은 `BaseListRow`, 항공사·공항·노선·기종 순위는 `FcRankingStats`를 함께 사용합니다.

SCSS도 `src/assets/scss/component/base/`와 `src/assets/scss/component/fc/`로 구분합니다. 페이지 전용 스타일은 `src/assets/scss/pages/page_페이지명.scss`로 작성합니다(예: `page_home.scss`, `page_flight_detail.scss`). 각 페이지는 사용하는 컴포넌트 SCSS를 먼저, 페이지 SCSS를 마지막에 import합니다. 공통 프레임과 통계 페이지 배치는 `layout/_frame.scss`, `layout/_stats.scss`에서 관리합니다. UI 갤러리의 스타일은 `pages/page_component.scss`에 있습니다.

데이터 관계·시간 계산·정렬 동작과 수정 예시는 [임시 데이터 가이드](docs/temp-data.md)를 참고합니다.

Vue 컴포넌트의 props 타입, 필수 여부, 기본값, 허용값, v-model, 이벤트와 데이터 구조는 [컴포넌트 속성 가이드](docs/components.md)를 참고합니다. `.prettierrc.json`으로 4칸 들여쓰기와 속성별 줄바꿈을 유지합니다.

피그마 `최종본` 페이지를 기준으로 공통 UI와 연결 화면을 반영했습니다. 디자인 컴포넌트와 Vue 파일의 대응 관계, 색상·서체·에셋 수정 위치는 [피그마 반영 가이드](docs/figma.md)를 참고합니다.

```sh
npm run dev
npm run build
```
