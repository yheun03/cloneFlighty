# Flighty 웹 퍼블리싱

이 프로젝트는 화면을 확인하기 위한 Vue · SCSS 퍼블리싱 프로젝트입니다. 실제 서비스 개발이나 서버 연동을 전제로 하지 않습니다.

- 화면 데이터는 각 페이지 Vue 파일 하단의 `<script setup>`에 있는 `pageData` 샘플 데이터 객체에서 수정합니다. 페이지는 필요한 컴포넌트를 직접 import하고 데이터를 props로 전달합니다.
- 공통 컴포넌트는 페이지에서 전달한 데이터를 표시하며, 자체 항공편·통계·친구 샘플 데이터를 갖지 않습니다.
- 공항·항공사 기준 정보는 `src/common/`에서 관리하고, 지도 기본 경로는 `MapLayout.vue`에서 수정합니다. 지도 배경은 기존 MapLibre와 OpenFreeMap을 사용합니다.
- 선택, 검색, 토글, 모달, 입력은 화면 상태를 확인하기 위한 동작입니다. 붙여넣기는 샘플 값을 넣고, 공유·초대·삭제는 미리보기 안내만 표시합니다.
- 화면 상태는 새로고침하면 초기화됩니다. API, 로그인, 실제 저장·전송 기능은 추가하지 않습니다.
- 변경 전 유사한 Vue 파일을 확인하고 기존 마크업, 클래스명, SCSS, 공통 컴포넌트 사용 방식을 따릅니다.

SCSS는 컴포넌트 기본 스타일을 `src/assets/scss/component/`, 페이지별 조정을 `src/assets/scss/pages/페이지명.scss`에서 수정합니다. 각 페이지는 사용하는 컴포넌트 SCSS와 자신의 페이지 SCSS를 직접 import합니다. 공통 프레임은 `MapLayout.vue`에서 `pages/_frame.scss`를 불러오고, 통계 페이지는 `pages/_stats.scss`를 함께 사용합니다. UI 컴포넌트 갤러리는 미리보기 화면으로 유지합니다.

Vue 컴포넌트의 props 타입, 필수 여부, 기본값, 허용값, v-model, 이벤트와 데이터 구조는 [컴포넌트 속성 가이드](docs/components.md)를 참고합니다. `.prettierrc.json`으로 4칸 들여쓰기와 속성별 줄바꿈을 유지합니다.

```sh
npm run dev
npm run build
```
