# Vue 컴포넌트 속성 가이드

컴포넌트는 src/component/base, src/component/fc에 있습니다. 타입·필수 여부·기본값은 각 Vue 파일의 defineProps가 기준입니다. 정해진 상태 값은 validator로 확인합니다. 아래 속성명은 script 기준 camelCase이며 템플릿에서는 show-period, initial-selected처럼 kebab-case로 작성합니다.

객체·배열은 페이지 JSON에서 전달합니다. 공통 컴포넌트에 화면 샘플 데이터를 추가하지 않습니다. 선언하지 않은 일반 HTML 속성은 단일 루트 요소에 전달됩니다.

## 파일 작성 기준

Vue는 import → defineProps → defineModel → defineEmits → 화면 상태 → computed → 이벤트 함수 → 생명주기 순서로 정리합니다. 템플릿에는 표시 구조를 두고 긴 계산과 여러 동작이 섞인 이벤트 식은 script에서 처리합니다.

SCSS는 기본 모양을 component/, 페이지별 조정을 pages/페이지명.scss에 둡니다. FramePages.scss는 \_frame.scss와 각 페이지 스타일을 기존 순서로 모읍니다. 통계 공통은 component/fc/\_stats.scss, 테마 색상은 common/\_theme.scss를 사용합니다.

.prettierrc.json은 기존 4칸 들여쓰기와 속성별 줄바꿈을 유지합니다. 인라인 아이콘·날짜 등에 있는 prettier-ignore는 자동 줄바꿈으로 텍스트 공백과 너비가 바뀌는 것을 막기 위한 것입니다.

```vue
<FcAddFlightSearch
    v-model="query"
    v-bind="pageData.search"
    @select="selectResult"
/>
```

이 예시에서 `v-model`은 검색 문자열, `v-bind`는 JSON의 props 묶음, `select`는 선택한 항목을 받는 이벤트입니다.

예약 편집 페이지 `FlightBookingPage.vue`의 `v-model`은 필수 Object이며 `{ code, seat, position, cabin, reason }` 구조입니다. 부모 `FlightDetailPage.vue`가 상태를 관리하고 모달에서 각 항목을 수정합니다.

## BaseButton

공통 버튼. click은 원래 MouseEvent를 전달합니다. type으로 button·submit·reset을 지정합니다.

| 속성       | 타입    | 필수 | 기본값·허용값                                  |
| ---------- | ------- | ---- | ---------------------------------------------- |
| `label`    | String  | 선택 | `"Show More"`                                  |
| `variant`  | String  | 선택 | `"link" / 허용: "link", "outline", "soft"`     |
| `icon`     | String  | 선택 | `""`                                           |
| `type`     | String  | 선택 | `"button" / 허용: "button", "submit", "reset"` |
| `disabled` | Boolean | 선택 | `false`                                        |

- 이벤트: `click`.

## BaseInput

공통 입력창. 값은 문자열입니다. id, class, required, maxlength, autocomplete, aria-\*와 입력 이벤트는 루트 input에 전달됩니다.

| 속성          | 타입    | 필수 | 기본값·허용값 |
| ------------- | ------- | ---- | ------------- |
| `type`        | String  | 선택 | `"text"`      |
| `placeholder` | String  | 선택 | `""`          |
| `disabled`    | Boolean | 선택 | `false`       |

- `v-model`: String, 기본값 `""`.

## FcIcon

src는 Lucide 아이콘 이름(예: plane) 또는 import한 SVG URL입니다. 장식용으로 aria-hidden을 사용합니다.

| 속성  | 타입   | 필수 | 기본값·허용값 |
| ----- | ------ | ---- | ------------- |
| `src` | String | 필수 | —             |

## FcToggleSwitch

v-model은 켜짐 여부입니다. label은 접근성 이름이며 disabled이면 선택할 수 없습니다.

| 속성       | 타입    | 필수 | 기본값·허용값 |
| ---------- | ------- | ---- | ------------- |
| `label`    | String  | 선택 | `"Toggle"`    |
| `disabled` | Boolean | 선택 | `false`       |

- `v-model`: Boolean, 기본값 `false`.

## FcChoiceChip

active는 선택 상태, filled는 채움 스타일입니다. click은 전달값 없이 발생하며 실제 선택값은 부모에서 변경합니다.

| 속성     | 타입    | 필수 | 기본값·허용값 |
| -------- | ------- | ---- | ------------- |
| `label`  | String  | 필수 | —             |
| `icon`   | String  | 선택 | `""`          |
| `active` | Boolean | 선택 | `false`       |
| `filled` | Boolean | 선택 | `false`       |

- 이벤트: `click`.

## FcPeriodTabs

items는 문자열 배열, v-model은 선택한 항목과 같은 문자열입니다.

| 속성    | 타입   | 필수 | 기본값·허용값 |
| ------- | ------ | ---- | ------------- |
| `label` | String | 선택 | `"조회 기간"` |
| `items` | Array  | 필수 | —             |

- `v-model`: String, 기본값 `"ALL-TIME"`.

## FcCountBadge

value는 숫자 또는 문자열, variant는 표시 방식입니다.

| 속성      | 타입            | 필수 | 기본값·허용값                                  |
| --------- | --------------- | ---- | ---------------------------------------------- |
| `value`   | String / Number | 선택 | `1`                                            |
| `variant` | String          | 선택 | `"plain" / 허용: "plain", "filled", "outline"` |

## FcCalendarPicker

month는 1~12, v-model은 날짜 숫자입니다. marked·outlined는 날짜 숫자 배열입니다. outlined 스타일은 항공편 추가 페이지에 있습니다.

| 속성       | 타입   | 필수 | 기본값·허용값   |
| ---------- | ------ | ---- | --------------- |
| `year`     | Number | 필수 | —               |
| `month`    | Number | 필수 | `— / 1~12 정수` |
| `marked`   | Array  | 선택 | `[]`            |
| `outlined` | Array  | 선택 | `[]`            |

- `v-model`: Number, 기본값 `20`.

## FcListRow

avatar는 문자·이모지, accent는 제목 강조입니다. click은 전달값 없이 발생합니다.

| 속성       | 타입    | 필수 | 기본값·허용값 |
| ---------- | ------- | ---- | ------------- |
| `title`    | String  | 필수 | —             |
| `subtitle` | String  | 선택 | `""`          |
| `avatar`   | String  | 선택 | `""`          |
| `accent`   | Boolean | 선택 | `false`       |

- 이벤트: `click`.

## FcPasteField

버튼을 누르면 sampleValue를 v-model에 넣습니다. label은 입력창 라벨, pasteLabel은 버튼 문구입니다.

| 속성          | 타입   | 필수 | 기본값·허용값 |
| ------------- | ------ | ---- | ------------- |
| `sampleValue` | String | 선택 | `""`          |
| `label`       | String | 선택 | `"Reason"`    |
| `placeholder` | String | 선택 | `"PASTE"`     |
| `pasteLabel`  | String | 선택 | `"붙여넣기"`  |

- `v-model`: String, 기본값 `""`.

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

upcoming은 예정 항공편, history는 지난 항공편, header는 상세 헤더입니다. days·avatar는 예정 항공편, duration·flightTime은 지난 항공편에 사용합니다. remove는 상세 헤더의 닫기 버튼에서 전달값 없이 발생합니다.

| 속성         | 타입    | 필수 | 기본값·허용값                                        |
| ------------ | ------- | ---- | ---------------------------------------------------- |
| `variant`    | String  | 선택 | `"upcoming" / 허용: "upcoming", "history", "header"` |
| `airline`    | String  | 필수 | —                                                    |
| `flight`     | String  | 필수 | —                                                    |
| `title`      | String  | 필수 | —                                                    |
| `date`       | String  | 필수 | —                                                    |
| `departure`  | String  | 필수 | —                                                    |
| `arrival`    | String  | 필수 | —                                                    |
| `duration`   | String  | 선택 | `""`                                                 |
| `flightTime` | String  | 선택 | `""`                                                 |
| `days`       | Number  | 선택 | `0`                                                  |
| `avatar`     | Boolean | 선택 | `false`                                              |

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

details는 [FlightDetailPage.json](../src/pages/data/FlightDetailPage.json)의 details·pastDetails 구조입니다. bookingCode·seat는 예약 편집 결과이며, edit·connection은 전달값 없이 발생합니다.

| 속성          | 타입    | 필수 | 기본값·허용값 |
| ------------- | ------- | ---- | ------------- |
| `details`     | Object  | 필수 | —             |
| `completed`   | Boolean | 선택 | `false`       |
| `bookingCode` | String  | 선택 | `""`          |
| `seat`        | String  | 선택 | `""`          |

- 이벤트: `edit`, `connection`.

## FcPassportOverview

recent는 { id, code, route, title, date } 목록입니다. select(flight)는 선택한 최근 항공편을 전달합니다. periods의 첫 항목이 최초 선택값입니다. [PassportPage.json](../src/pages/data/PassportPage.json)의 overview를 참고합니다.

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

delayed·total은 항공편 수, lostMinutes는 분 단위 누적 지연입니다. 총 항공편이나 지연 항공편이 0이면 비율·평균을 0으로 표시합니다.

| 속성           | 타입   | 필수 | 기본값·허용값 |
| -------------- | ------ | ---- | ------------- |
| `delayed`      | Number | 필수 | —             |
| `total`        | Number | 필수 | —             |
| `worstDelay`   | String | 필수 | —             |
| `worstAirline` | String | 필수 | —             |
| `lostMinutes`  | Number | 필수 | —             |

## FcAircraftStats

aircraft는 [AircraftStatsPage.json](../src/pages/data/AircraftStatsPage.json)의 aircraft 구조입니다. show\*는 각 영역의 표시 여부이며 showAgeTitle은 showAge 영역의 제목만 제어합니다.

| 속성           | 타입    | 필수 | 기본값·허용값 |
| -------------- | ------- | ---- | ------------- |
| `aircraft`     | Object  | 필수 | —             |
| `showPeriod`   | Boolean | 선택 | `true`        |
| `showAge`      | Boolean | 선택 | `true`        |
| `showAgeTitle` | Boolean | 선택 | `true`        |
| `showTail`     | Boolean | 선택 | `true`        |
| `showOverview` | Boolean | 선택 | `true`        |

## FcAirlinePerformance

report는 [DelayStatsPage.json](../src/pages/data/DelayStatsPage.json)의 performance 구조입니다. section으로 전체·항공사·공항·개인·지연 영역을 선택합니다. 최초 목록은 성과 5개, 지연 4개입니다.

| 속성      | 타입   | 필수 | 기본값·허용값                                                 |
| --------- | ------ | ---- | ------------------------------------------------------------- |
| `section` | String | 선택 | `"all" / 허용: "all", "airline", "airport", "mine", "delays"` |
| `report`  | Object | 필수 | —                                                             |

## FcSeatStats

rows는 { name, count, percent, color } 목록입니다. percent는 0~100 숫자, color는 CSS 색상입니다. mode별 데이터는 [AircraftStatsPage.json](../src/pages/data/AircraftStatsPage.json)의 seats를 참고합니다.

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

## FcTopAirlines

items는 { name, flights, distance } 목록이며 distance는 km 숫자입니다. limit는 접힌 목록 개수, showNames는 아이콘 대신 이름 표시, showTabs는 횟수·거리 전환 표시입니다.

| 속성        | 타입            | 필수 | 기본값·허용값              |
| ----------- | --------------- | ---- | -------------------------- |
| `title`     | String          | 선택 | `"Top Airlines"`           |
| `total`     | Number / String | 선택 | `0`                        |
| `unit`      | String          | 선택 | `"total airlines"`         |
| `showNames` | Boolean         | 선택 | `false`                    |
| `showTabs`  | Boolean         | 선택 | `true`                     |
| `color`     | String          | 선택 | `"var(--fc-chart-purple)"` |
| `limit`     | Number          | 선택 | `3`                        |
| `items`     | Array           | 필수 | —                          |

## FcFlightDistanceStats

breakdown은 { label, value }, comparisons는 { icon, text }, 최단·최장 항공편은 { title, route, distance, detail } 구조입니다. view의 toggle은 전환 버튼, summary는 요약, breakdown은 상세를 표시합니다. [FlightStatsPage.json](../src/pages/data/FlightStatsPage.json)의 distance를 참고합니다.

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

## FcComponentGallery

data는 [ComponentPage.json](../src/pages/data/ComponentPage.json)의 전체 구조입니다. gallery.catalog는 카드 설명·분류, 나머지는 미리보기 데이터입니다. v-show로 분류를 바꿔도 미리보기 상태를 유지합니다.

| 속성   | 타입   | 필수 | 기본값·허용값 |
| ------ | ------ | ---- | ------------- |
| `data` | Object | 필수 | —             |
