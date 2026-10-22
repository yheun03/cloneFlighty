# Vue 컴포넌트 속성 가이드

기본 UI는 `src/component/base/`에, 항공편·통계·설정 등 플라이티 전용 조합은 `src/component/fc/`에 있습니다. 같은 기능은 컴포넌트 파일을 나누지 않고 `type`, `variant`, `size` 등의 props로 구분합니다. 타입·필수 여부·기본값은 각 Vue 파일의 defineProps가 기준입니다. 정해진 상태 값은 validator로 확인합니다. 아래 속성명은 script 기준 camelCase이며 템플릿에서는 show-period, initial-selected처럼 kebab-case로 작성합니다.

목록·상세·패스포트·항공편 검색은 `src/data/temp/`의 공통 JSON을 `src/common/flights.js`에서 연결해 props로 전달합니다. 다른 화면의 독립적인 예시는 페이지 하단 `pageData`에서 관리합니다. 데이터 구조는 [임시 데이터 가이드](temp-data.md)를 참고합니다. 페이지는 사용하는 공통 컴포넌트를 직접 import합니다. 공통 컴포넌트에 화면 샘플 데이터를 추가하지 않습니다. 선언하지 않은 일반 HTML 속성은 단일 루트 요소에 전달됩니다.

## 파일 작성 기준

공통 컴포넌트의 Vue는 import → defineProps → defineModel → defineEmits → 화면 상태 → computed → 이벤트 함수 → 생명주기 순서로 정리합니다. 페이지는 template을 먼저 두고 하단의 `<script setup>`에서 import → 샘플 데이터 → 화면 상태 → computed → 이벤트 함수 순서로 정리합니다. 템플릿에는 표시 구조를 두고 긴 계산과 여러 동작이 섞인 이벤트 식은 script에서 처리합니다.

SCSS는 기본 UI를 `src/assets/scss/component/base/`, 플라이티 전용 컴포넌트를 `src/assets/scss/component/fc/`, 페이지별 배치를 `src/assets/scss/pages/page_페이지명.scss`에 둡니다. 예를 들어 `HomePage.vue`는 `page_home.scss`, `FlightStatsPage.vue`는 `page_flight_stats.scss`를 사용합니다. 각 페이지는 필요한 컴포넌트 SCSS를 먼저 import하고 페이지 SCSS를 마지막에 import합니다. 공통 프레임은 `MapLayout.vue`에서 `layout/_frame.scss`를 불러옵니다. 통계 컴포넌트 공통은 `component/fc/_stats.scss`, 통계 페이지 공통은 `layout/_stats.scss`, 테마 색상은 `common/_theme.scss`를 사용합니다.

.prettierrc.json은 기존 4칸 들여쓰기와 속성별 줄바꿈을 유지합니다. 샘플 데이터 객체의 prettier-ignore는 현재 형식을 유지하고, 인라인 아이콘·날짜 등의 prettier-ignore는 자동 줄바꿈으로 텍스트 공백과 너비가 바뀌는 것을 막기 위한 것입니다.

```vue
<FcAddFlightSearch
    v-model="query"
    v-bind="pageData.search"
    @select="selectResult"
/>
```

이 예시에서 `v-model`은 검색 문자열, `v-bind`는 JSON의 props 묶음, `select`는 선택한 항목을 받는 이벤트입니다.

예약 편집 페이지 `FlightBookingPage.vue`의 `v-model`은 필수 Object이며 `{ code, seat, position, cabin, reason }` 구조입니다. 부모 `FlightDetailPage.vue`가 공통 항공편의 booking을 연결하고 모달에서 각 항목을 수정합니다. 항공편별로 편집값이 분리됩니다.

## BaseButton

공통 버튼입니다. `click`은 원래 MouseEvent를 전달합니다.

- `label`: String, 기본값 `""`. 아이콘만 있으면 아이콘 버튼이 됩니다.
- `size`: `"sm" | "md" | "lg"`, 기본값 `"md"`.
- `variant`: `"fill" | "text"`, 기본값 `"fill"`.
- `tone`: `"default" | "red" | "gray" | "primary"`, 기본값 `"default"`.
- `icon`: String, 기본값 `""`. `iconSize`: String 또는 Number, 기본값 `""`.
- `type`: `"button" | "submit" | "reset"`, 기본값 `"button"`.
- `disabled`: Boolean, 기본값 `false`.

## BaseInput

문자열 입력창입니다. 텍스트·검색·날짜 선택은 `type`으로 구분합니다. `id`, `class`, `required`, `maxlength`, `autocomplete`, `aria-*`와 입력 이벤트는 실제 input에 전달됩니다.

- `type`: String, 기본값 `"text"`. 일반 HTML input 타입과 `"calendar"`를 지원합니다.
- `placeholder`, `icon`, `actionLabel`: String, 기본값 `""`.
- `disabled`: Boolean, 기본값 `false`.
- `calendarOptions`: Object, 기본값 `{}`. `type="calendar"`일 때 달력의 `year`, `month`, `marked`, `outlined`를 전달합니다. 입력값이 `YYYY-MM-DD`이면 그 연월이 먼저 표시됩니다.
- `v-model`: String, 기본값 `""`. 날짜 선택은 `YYYY-MM-DD` 문자열입니다.
- 이벤트: `action`. `actionLabel` 버튼을 누르면 발생하고, 샘플 값 적용 등의 처리는 부모 페이지가 담당합니다.

## BaseIcon

src는 Lucide 아이콘 이름(예: plane) 또는 import한 SVG URL입니다. 빈 문자열이면 크기만 유지하고 배경·대체 도형을 그리지 않습니다. 장식용으로 aria-hidden을 사용합니다.

| 속성  | 타입   | 필수 | 기본값·허용값 |
| ----- | ------ | ---- | ------------- |
| `src` | String | 필수 | —             |

## BaseToggleSwitch

토글·체크박스·라디오는 `type`으로 구분합니다. `label`은 접근성 이름입니다.

- `type`: `"button" | "checkbox" | "radio"`, 기본값 `"button"`. button은 switch 역할로 표시합니다.
- `label`: String, 기본값 `"Toggle"`. `disabled`: Boolean, 기본값 `false`.
- `value`: String / Number / Boolean, 기본값 `true`.
- `v-model`: 기본값 `false`. 토글은 Boolean, 체크박스는 Boolean 또는 선택값 배열, 라디오는 `value`에 해당하는 단일 값입니다.

## BaseChip

텍스트·아이콘 칩과 선택 상태를 표시합니다.

- `label`: String, 필수. `icon`: String, 기본값 `""`.
- `active`, `disabled`: Boolean, 기본값 `false`.
- 이벤트: `click(MouseEvent)`. 실제 선택 상태는 부모에서 변경합니다.

## BaseTabItem

기간 선택, 단위 선택, 체크박스·라디오 그룹과 3단계 정렬이 같은 컴포넌트를 사용합니다.

- `items`: 문자열 Array, 필수. `label`: String, 기본값 `"탭 선택"`.
- `type`: `"tab" | "checkbox" | "radio" | "sort"`, 기본값 `"tab"`.
- `variant`: `"fill" | "stroke" | "segment"`, 기본값 `"fill"`.
- `size`: `"md" | "sm"`, 기본값 `"md"`. `icon`: String, 기본값 `""`.
- `v-model`: 기본값 `""`. tab·radio는 단일 값, checkbox는 선택값 배열입니다. sort는 활성 정렬 항목이며 빈 값이면 기본 날짜순입니다.
- `v-model:order`: `"" | "desc" | "asc"`, 기본값 `""`. sort 타입에서 첫 클릭은 내림차순(아래), 두 번째는 오름차순(위), 세 번째는 정렬 해제입니다. 새 항목은 내림차순으로 시작합니다.

## BaseCalendarPicker

월 이동, 연월 선택, 날짜 선택을 지원합니다. 표시 스타일도 컴포넌트 SCSS에서 관리합니다.

- `year`: Number, 필수. `month`: Number, 필수, 1~12 정수.
- `marked`, `outlined`: 날짜 숫자 Array, 기본값 `[]`. 각각 채움·테두리 표시입니다.
- `v-model`: String, 기본값 `""`. `YYYY-MM-DD` 문자열을 전달합니다.

## BaseListRow

설정·친구 목록과 검색 결과가 같은 마크업을 사용합니다.

- `title`: String, 필수. `subtitle`, `avatar`, `image`, `icon`: String, 기본값 `""`.
- `type`: `"icon" | "profile"`, 기본값 `"icon"`. 왼쪽 시각 요소를 구분합니다.
- `shape`: `"" | "single" | "double"`, 기본값 `""`. 미지정 시 subtitle 유무로 결정합니다.
- `variant`: `"default" | "search"`, 기본값 `"default"`. search는 검색 결과의 간격과 화살표 테두리를 표시합니다.
- `arrowIcon`: String, 기본값은 프로젝트의 chevron-right SVG입니다. 검색 결과는 `"arrow-right"`를 전달합니다.
- `accent`: Boolean, 기본값 `false`.
- 이벤트: `click`. 선택 데이터는 부모에서 전달합니다.

`translateSubtitle`은 Boolean, 기본값 `true`입니다. 언어 선택지의 원어 이름처럼 번역하지 않는 보조 문구는 `false`로 전달합니다.

## FcConnectionStatus

duration은 실제 환승 시간, extra는 권장 최소 시간보다 여유 있는 시간입니다.

| 속성       | 타입   | 필수 | 기본값·허용값 |
| ---------- | ------ | ---- | ------------- |
| `title`    | String | 필수 | —             |
| `duration` | String | 필수 | —             |
| `extra`    | String | 필수 | —             |

## FcTerminalTimeline

도착·출발 시간과 터미널·게이트 문구를 표시합니다.

| 속성        | 타입   | 필수 | 기본값·허용값 |
| ----------- | ------ | ---- | ------------- |
| `arrival`   | String | 필수 | —             |
| `departure` | String | 필수 | —             |
| `terminal`  | String | 필수 | —             |
| `gate`      | String | 필수 | —             |

## FcFlightListItem

upcoming은 예정 항공편, history는 지난 항공편, header는 상세 헤더입니다. 기본·친구 항공편은 `type="default" | "friend"`로 구분하며 기본값은 `"default"`입니다. `profile`은 친구 이미지 URL이며 기본값은 `""`입니다. days·profile은 예정 항공편, duration·flightTime은 지난 항공편에 사용합니다. remove는 상세 헤더의 닫기 버튼에서 전달값 없이 발생합니다.

| 속성         | 타입   | 필수 | 기본값·허용값                                        |
| ------------ | ------ | ---- | ---------------------------------------------------- |
| `variant`    | String | 선택 | `"upcoming" / 허용: "upcoming", "history", "header"` |
| `airline`    | String | 필수 | —                                                    |
| `flight`     | String | 필수 | —                                                    |
| `title`      | String | 필수 | —                                                    |
| `date`       | String | 필수 | —                                                    |
| `departure`  | String | 필수 | —                                                    |
| `arrival`    | String | 필수 | —                                                    |
| `duration`   | String | 선택 | `""`                                                 |
| `flightTime` | String | 선택 | `""`                                                 |
| `days`       | Number | 선택 | `0`                                                  |

- 이벤트: `remove`.

## FcAddFlightSearch

items는 { title, subtitle, avatar, type, code } 목록입니다. title과 subtitle로 검색하고 선택 시 select(item)을 발생시킵니다. type·code는 부모 페이지에서 이동에 사용합니다.

| 속성           | 타입   | 필수 | 기본값·허용값                 |
| -------------- | ------ | ---- | ----------------------------- |
| `items`        | Array  | 필수 | —                             |
| `placeholder`  | String | 선택 | `"Korean Air, ICN, or KE123"` |
| `sectionLabel` | String | 선택 | `""`                          |

- `v-model`: String, 기본값 `""`.
- 이벤트: `select`.

## FcFlightDetails

details는 [FlightDetailPage.vue](../src/pages/FlightDetailPage.vue)의 computed에서 공통 항공편·항공사·공항·기체 정보를 연결한 표시 데이터입니다. departureTiming·arrivalTiming은 late/early/on-time/unknown 상태이며, phone·website·x·facebook은 실제 링크에 사용합니다. takeoff·landing은 기록된 실제 이륙·착륙의 현지 시각입니다. recordedAircraftType은 항공편에 기록된 탑승 기종, aircraftInfo는 외부에서 조회한 현재 등록 정보이며 aircraftSource로 출처를 연결합니다. aircraftMessage는 조회 상태를 표시합니다. firstFlight·age·capacity·engines는 값이 있을 때만 표시하며, forecast가 빈 배열이면 관측 막대를 표시하지 않습니다. bookingCode·seat는 예약 편집 결과이며, edit·connection은 전달값 없이 발생합니다.

| 속성          | 타입    | 필수 | 기본값·허용값 |
| ------------- | ------- | ---- | ------------- |
| `details`     | Object  | 필수 | —             |
| `completed`   | Boolean | 선택 | `false`       |
| `bookingCode` | String  | 선택 | `""`          |
| `seat`        | String  | 선택 | `""`          |

- 이벤트: `edit`, `connection`.

## FcPassportOverview

recent는 { id, code, route, title, date } 목록입니다. select(flight)는 선택한 최근 항공편을 전달합니다. periods의 첫 항목이 최초 선택값입니다. [PassportPage.vue](../src/pages/PassportPage.vue) 하단 샘플 데이터의 overview를 참고합니다.

| 속성           | 타입    | 필수 | 기본값·허용값 |
| -------------- | ------- | ---- | ------------- |
| `flights`      | Number  | 필수 | —             |
| `distance`     | String  | 필수 | —             |
| `flightTime`   | String  | 필수 | —             |
| `airports`     | Number  | 필수 | —             |
| `airlines`     | Number  | 필수 | —             |
| `recent`       | Array   | 선택 | `[]`          |
| `periods`      | Array   | 필수 | —             |
| `mapFrom`      | String  | 필수 | —             |
| `mapTo`        | String  | 필수 | —             |
| `flags`        | String  | 필수 | —             |
| `historyTitle` | String  | 필수 | —             |
| `historyCount` | String  | 필수 | —             |
| `showPeriod`   | Boolean | 선택 | `true`        |
| `showMap`      | Boolean | 선택 | `true`        |
| `showHistory`  | Boolean | 선택 | `true`        |

- 이벤트: `select`.

## FcDelayReport

brandIcon은 선택 String이며 기본값 `""`입니다. 아이콘이 없으면 영역만 유지합니다. delayed·total은 항공편 수, lostMinutes는 분 단위 누적 지연입니다. 총 항공편이나 지연 항공편이 0이면 비율·평균을 0으로 표시합니다.

| 속성           | 타입   | 필수 | 기본값·허용값 |
| -------------- | ------ | ---- | ------------- |
| `delayed`      | Number | 필수 | —             |
| `total`        | Number | 필수 | —             |
| `worstDelay`   | String | 필수 | —             |
| `worstAirline` | String | 필수 | —             |
| `lostMinutes`  | Number | 필수 | —             |

## FcAircraftStats

aircraft는 [AircraftStatsPage.vue](../src/pages/AircraftStatsPage.vue) 하단 샘플 데이터의 aircraft 구조입니다. show\*는 각 영역의 표시 여부이며 showAgeTitle은 showAge 영역의 제목만 제어합니다.

| 속성           | 타입    | 필수 | 기본값·허용값 |
| -------------- | ------- | ---- | ------------- |
| `aircraft`     | Object  | 필수 | —             |
| `showPeriod`   | Boolean | 선택 | `true`        |
| `showAge`      | Boolean | 선택 | `true`        |
| `showAgeTitle` | Boolean | 선택 | `true`        |
| `showTail`     | Boolean | 선택 | `true`        |
| `showOverview` | Boolean | 선택 | `true`        |

## FcAirlinePerformance

report는 [DelayStatsPage.vue](../src/pages/DelayStatsPage.vue) 하단 샘플 데이터의 performance 구조입니다. section으로 전체·항공사·공항·개인·지연 영역을 선택합니다. 최초 목록은 성과 5개, 지연 4개입니다.

| 속성      | 타입   | 필수 | 기본값·허용값                                                 |
| --------- | ------ | ---- | ------------------------------------------------------------- |
| `section` | String | 선택 | `"all" / 허용: "all", "airline", "airport", "mine", "delays"` |
| `report`  | Object | 필수 | —                                                             |

## FcSeatStats

rows는 { name, count, percent, color } 목록입니다. percent는 0~100 숫자, color는 CSS 색상입니다. mode별 데이터는 [AircraftStatsPage.vue](../src/pages/AircraftStatsPage.vue) 하단 샘플 데이터의 seats를 참고합니다.

| 속성        | 타입    | 필수 | 기본값·허용값                              |
| ----------- | ------- | ---- | ------------------------------------------ |
| `mode`      | String  | 선택 | `"seat" / 허용: "seat", "class", "reason"` |
| `showTitle` | Boolean | 선택 | `true`                                     |
| `topLabel`  | String  | 필수 | —                                          |
| `topValue`  | String  | 필수 | —                                          |
| `rows`      | Array   | 필수 | —                                          |

## FcFrequentTails

항공사·국기·등록 번호·탑승 횟수·기종을 표시합니다.

| 속성      | 타입   | 필수 | 기본값·허용값 |
| --------- | ------ | ---- | ------------- |
| `airline` | String | 필수 | —             |
| `flag`    | String | 필수 | —             |
| `tail`    | String | 필수 | —             |
| `flights` | Number | 필수 | —             |
| `model`   | String | 필수 | —             |

## FcCountriesStats

countries는 { name, flag, count }, regions는 { name, count, percent } 목록입니다. regions.percent는 표시용 문자열입니다. 최초 국가 목록은 3개입니다.

| 속성        | 타입   | 필수 | 기본값·허용값 |
| ----------- | ------ | ---- | ------------- |
| `total`     | Number | 필수 | —             |
| `countries` | Array  | 필수 | —             |
| `regions`   | Array  | 필수 | —             |

## FcRankingStats

항공사·공항·노선·기종 순위가 같은 막대 차트 컴포넌트를 사용합니다. 기존 `FcTopAirlines`의 호출부를 이 컴포넌트로 변경했습니다. 기존 `fc-top-airlines` 클래스는 디자인 일관성을 위해 유지합니다.

- `type`: `"airline" | "airport" | "route" | "aircraft"`, 기본값 `"airline"`. airline은 로고(없으면 IATA·이름), 나머지는 이름을 표시합니다.
- `title`: String, 기본값 `"Top Airlines"`. `unit`: String, 기본값 `"total airlines"`.
- `total`: Number / String, 기본값 `0`.
- `items`: Array, 필수. 항목은 `{ name, iata?, flights, distance }`이며 distance 단위는 km입니다.
- `showTabs`: Boolean, 미지정 시 airline·route는 표시하고 airport·aircraft는 숨깁니다. 선택은 `BaseTabItem`의 radio 타입을 사용합니다.
- `color`: String, 기본값 `"var(--fc-chart-purple)"`. `limit`: Number, 기본값 `3`.

선택한 Flights·Distance 값의 내림차순으로 정렬한 뒤 limit을 적용합니다. 같은 값이면 이름순입니다. 거리 라벨은 공통 설정에서 선택한 거리 단위의 compact 표기로 표시합니다. 선택·정렬에는 원래 키와 km 값을 유지하고 표시 문구만 번역합니다.

```vue
<FcRankingStats v-bind="pageData.airlines" type="airline" />
<FcRankingStats v-bind="pageData.airports" type="airport" />
<FcRankingStats v-bind="pageData.routes" type="route" />
<FcRankingStats v-bind="pageData.types" type="aircraft" />
```

## FcFlightDistanceStats

breakdown은 { label, value }, comparisons는 { icon, text }, 최단·최장 항공편은 { title, route, distance, detail } 구조입니다. view의 toggle은 전환 버튼, summary는 요약, breakdown은 상세를 표시합니다. [FlightStatsPage.vue](../src/pages/FlightStatsPage.vue)의 statistics computed에서 기간별 distance 표시값을 계산합니다.

| 속성             | 타입   | 필수 | 기본값·허용값                                       |
| ---------------- | ------ | ---- | --------------------------------------------------- |
| `title`          | String | 필수 | —                                                   |
| `shareLabel`     | String | 필수 | —                                                   |
| `shareIcon`      | String | 필수 | —                                                   |
| `distance`       | String | 필수 | —                                                   |
| `distanceUnit`   | String | 필수 | —                                                   |
| `miles`          | String | 필수 | —                                                   |
| `milesUnit`      | String | 필수 | —                                                   |
| `breakdown`      | Array  | 필수 | —                                                   |
| `averageLabel`   | String | 필수 | —                                                   |
| `comparisons`    | Array  | 필수 | —                                                   |
| `summaryLabel`   | String | 필수 | —                                                   |
| `breakdownLabel` | String | 필수 | —                                                   |
| `shortestFlight` | Object | 필수 | —                                                   |
| `longestFlight`  | Object | 필수 | —                                                   |
| `view`           | String | 선택 | `"toggle" / 허용: "toggle", "summary", "breakdown"` |

## FcAlertSettings

options는 { title, desc, icon, color, enabled } 목록입니다. mine은 개별 토글, friends·friend는 단일 선택입니다. initialShared·initialSelected·options는 최초 표시 상태이며 내부 변경은 원본에 반영하지 않습니다. 새 초기값은 부모의 key로 다시 마운트해 적용합니다. remove는 전달값이 없습니다. 슬롯은 intro, after-options입니다.

| 속성              | 타입    | 필수 | 기본값·허용값                                |
| ----------------- | ------- | ---- | -------------------------------------------- |
| `mode`            | String  | 선택 | `"mine" / 허용: "mine", "friends", "friend"` |
| `title`           | String  | 필수 | —                                            |
| `desc`            | String  | 필수 | —                                            |
| `options`         | Array   | 필수 | —                                            |
| `initialShared`   | Boolean | 선택 | `false`                                      |
| `initialSelected` | String  | 선택 | `""`                                         |
| `friendName`      | String  | 선택 | `""`                                         |
| `friendEmail`     | String  | 선택 | `""`                                         |

- 이벤트: `remove`.

## FcCalendarSync

calendars는 이름 문자열 배열입니다. settings는 { importEnabled, exportEnabled, importCalendars, exportCalendar }입니다. 가져오기는 다중 선택, 내보내기는 단일 선택입니다. settings는 최초 상태이며 이후 선택은 내부에서 관리합니다.

| 속성        | 타입   | 필수 | 기본값·허용값 |
| ----------- | ------ | ---- | ------------- |
| `calendars` | Array  | 필수 | —             |
| `settings`  | Object | 필수 | —             |

## FcSettingsMenu

groups는 { label, items: [{ name, title, icon }] } 목록, membership은 { title, status }입니다. select(item)은 메뉴 객체를, 멤버십 버튼은 문자열 pro를 전달합니다.

| 속성         | 타입   | 필수 | 기본값·허용값 |
| ------------ | ------ | ---- | ------------- |
| `groups`     | Array  | 필수 | —             |
| `membership` | Object | 필수 | —             |

- 이벤트: `select`.
