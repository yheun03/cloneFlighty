# 피그마 반영 기준

기준 디자인은 [Flighty 최종본](https://www.figma.com/design/OSTnh93dlCB9OF8PVHruJj?node-id=2245-2648)입니다. 공통 컴포넌트를 수정하면 해당 컴포넌트를 사용하는 화면과 `/component` 갤러리에 함께 반영됩니다.

## 컴포넌트 대응

- `Button`, `input` → `BaseButton.vue`, `BaseInput.vue`
- `Toggle`, `TabItem`, `CalendarItem`, `chips` → `BaseToggleSwitch.vue`, `BaseTabItem.vue`, `BaseCalendarPicker.vue`, `BaseChip.vue`
- `DueItem`, `Past` → `FcFlightListItem.vue`의 `upcoming`, `history` 형태
- `SelectRouter` → `BaseListRow.vue`. 설정 메뉴도 같은 컴포넌트를 사용합니다.
- `SelectItem` → `BaseListRow.vue`의 `variant="search"`. `FcAddFlightSearch.vue`도 이 컴포넌트를 사용합니다
- `SelectCard` → `FcAlertSettings.vue`. 내 항공편은 토글, 친구 항공편은 단일 선택 카드입니다.
- `ItemSchedule` → `FcFlightDetails.vue`의 출도착 정보
- `DetailTitle`, `Graph` → 통계 공통 SCSS와 기존 통계 컴포넌트
- `SectionTitle`, `SectionSubTitle` → 페이지 공통 제목과 각 화면의 섹션 제목

`Units`의 둥근 단위 선택은 `BaseTabItem`에 `variant="segment"`, `type="radio"`를 전달합니다. 형태는 공통 `BaseTabItem.scss`에서 관리하며, `/component`의 **단위 선택 라디오 (Units)** 예시에서도 같은 컴포넌트를 사용합니다.

## 스타일 수정 위치

- 색상은 `src/assets/scss/common/_theme.scss`의 CSS 변수를 사용합니다. 기본 다크 색상은 배경 `#18181b`, 컨트롤 `#2c2c2c`, 강조색 `#007aff`입니다.
- 서체는 기존 `typography.font()` mixin을 사용합니다. 모바일 화면 제목의 36px/44px만 `mo-d4` 토큰으로 추가했습니다.
- 입력창은 최소 높이 46px, 본문 15px/22px입니다.
- 항공편 목록은 날짜 영역 60px, 영역 간격 16px, 제목 20px/28px입니다. 출도착 정보는 읽기용 텍스트로 표시합니다.
- 통계 제목은 24px/34px, 주요 숫자는 56px/72px입니다.
- 컴포넌트 스타일은 `src/assets/scss/component/base/`와 `src/assets/scss/component/fc/`에서 관리합니다. 페이지별 배치 조정은 `src/assets/scss/pages/page_페이지명.scss`, 공통 프레임·통계 배치는 `src/assets/scss/layout/`에서 관리합니다.

## 에셋과 데이터

피그마에서 내려받은 아이콘과 항공기 이미지는 `src/assets/figma/`에 저장합니다. 임시 피그마 URL은 실행 코드에 사용하지 않습니다. SVG 파일의 원본 크기는 유지합니다.

`BaseIcon`은 기존 Lucide 이름과 피그마 에셋 이름을 지원합니다. 피그마 에셋은 `share`, `speed`, `alert-basics`, `alert-check`, `alert-map`처럼 파일명에서 `.svg`를 뺀 이름이나 import한 URL로 전달합니다.

`BaseListRow`의 `image`는 국기 등 색상이 있는 SVG를 원본 그대로 표시하는 선택 속성입니다. `icon`은 기존 `BaseIcon` 방식으로 표시합니다.

항공기 이미지는 페이지 샘플 데이터에서 `details.image`, `aircraft.image`, `aircraft.newest.image`, `aircraft.oldest.image`로 전달합니다. 모델명과 설명도 해당 데이터에서 수정합니다. 공통 컴포넌트에는 화면용 샘플 데이터를 넣지 않습니다.

지도와 화면 이동은 기존 웹 미리보기 프레임을 사용합니다. 피그마의 iOS 상태 표시줄과 홈 인디케이터는 브라우저 UI에 추가하지 않습니다. 검색·선택·토글·예약 편집·공유는 기존 퍼블리싱 미리보기 동작입니다.
