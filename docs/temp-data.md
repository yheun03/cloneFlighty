# 임시 항공편 데이터

목록, 상세, 패스포트, 항공편 통계, 검색은 `src/data/temp/`의 데이터를 함께 사용합니다. 현재 항공편은 제공된 `FlightyExport-2026-10-22 (1).csv`의 30행과 수동 추가한 KE81·KE86 2편, 총 32편입니다. 2026-10-22 기준 지난 여정 28편, 앞으로의 여정 4편이며 친구 항공편은 없습니다.

수동 추가한 여정은 2026년 10월 15일 KE81(ICN → JFK), 10월 17일 KE86(JFK → ICN, 10월 18일 도착)입니다. 예정 시각과 터미널은 [KE81 운항 시간표](https://www.flight.info/KE81), [KE86 운항 시간표](https://www.flight.info/KE086)를 참고했습니다. 날짜·편명·노선이 일치하는 [KE81 운항 이력](https://www.flightradar24.com/data/flights/ke81), [KE86 운항 이력](https://www.flightradar24.com/data/flights/ke86)에서 HL7621(A380-800)·HL8041(777-300ER)을 확인해 연결했고 `aircraft.source`에 출처를 남겼습니다. 실제 시각·게이트는 `null`, 예약 정보는 빈 문자열입니다. `source`는 원본 CSV 파일명을 유지합니다.

앞으로의 여정은 LJ 367(ICN → KIX, 11월 7일), LJ 384(KIX → ICN, 11월 10일), OZ 152(ICN → SDJ, 12월 4일), OZ 151(SDJ → ICN, 12월 6일)입니다. 기존 가상 항공편은 이 데이터로 교체했습니다.

## 파일과 연결 기준

- `src/data/reference/airlines.json`: airline-codes의 OpenFlights 데이터에서 항공사명·IATA·ICAO·callsign·국가를 생성합니다. CSV의 ICAO 코드는 IATA로 연결합니다. 로고·공식 연락처·SNS는 `src/data/airline-details.json`에서 보완합니다.
- `src/data/reference/airports.json`: airport-data-js에서 공항명·코드·좌표·IANA 시간대·국가·대륙·홈페이지를 생성합니다. 도시 표시명만 `src/data/airport-display.json`으로 보완하며 국기는 국가 코드로 생성합니다.
- `flights.json`: 항공편 배열과 원본 파일명(`source`), 분류 기준일(`referenceDate`)을 관리합니다. `airline`, `departure.airport`, `arrival.airport`로 기준 정보를 연결합니다. `aircraft`에는 항공편의 등록번호(`registration`)와 기록된 탑승 기종(`type`)만 둡니다. `id`는 IATA·편명·출발일 조합(예: `lj-367-2026-11-07`)입니다. Flighty ID는 사용하지 않습니다.

연결과 표시값 계산은 `src/common/flights.js`에서 처리합니다. 새 항공편의 항공사·공항 코드는 `npm run data:refresh`로 공개 기준 정보에 연결합니다. 컴포넌트에는 필요한 표시 항목만 props로 전달합니다.

## CSV 필드 대응

- Date → `date`, Airline → `airline`(IATA로 변환), Flight → `number`, From·To → 출도착 `airport`.
- Dep/Arr Terminal·Gate → 출도착 `terminal`, `gate`. 원본 값(예: `D`, `MAIN`, `2`)은 유지하고 상세 화면에서 Terminal 접두사를 붙입니다.
- Gate Departure/Arrival (Scheduled) → 출도착 `scheduledAt`, (Actual) → `actualAt`.
- Take off (Scheduled/Actual) → `departure.takeoffScheduledAt`, `takeoffActualAt`.
- Landing (Scheduled/Actual) → `arrival.landingScheduledAt`, `landingActualAt`.
- Canceled → `canceled`(Boolean), Diverted To → `divertedTo`.
- Aircraft Type Name·Tail Number → 항공편의 `aircraft.type`, `aircraft.registration`. 과거 탑승 기종은 현재 등록 정보와 구분합니다.
- PNR·Seat·Seat Type·Cabin Class·Flight Reason → `booking.code`, `seat`, `position`, `cabin`, `reason`. WINDOW → Window, MIDDLE → Middle, ECONOMY → Economy, PREMIUM_ECONOMY → Premium Economy, LEISURE → Leisure로 표시값을 변환했습니다. 빈 예약 정보는 빈 문자열입니다.
- Notes → `notes`. CSV의 Flighty ID 컬럼들은 예제 데이터에 포함하지 않습니다.

예약 외 비어 있는 원본 필드는 `null`입니다. CSV에 없는 수하물 벨트 번호도 `null`입니다. `status`는 원본의 취소 여부와 기준일로 분류한 예제 상태이며, 기준일 이전은 `completed`, 이후는 `upcoming`입니다. 과거 항공편의 실제 도착 시각이 비어 있어도 지난 여정에 포함합니다. 이 상태는 자동으로 날짜에 따라 이동하지 않으므로 새 예제 일정으로 바꾸면 기준일과 상태도 함께 갱신합니다.

## 날짜와 시간

CSV의 시간은 UTC 오프셋이 없는 현지 시간입니다. 출발·이륙 시각은 출발 공항, 착륙·도착 시각은 도착 공항의 IANA 시간대로 해석해 날짜별 서머타임을 반영한 ISO 문자열로 저장했습니다.

```json
{
    "airport": "KIX",
    "scheduledAt": "2026-11-10T23:25:00+09:00",
    "actualAt": null,
    "takeoffScheduledAt": null,
    "takeoffActualAt": null,
    "terminal": "1",
    "gate": null
}
```

- 표시 시각은 `actualAt → estimatedAt → scheduledAt` 순서입니다. CSV에는 estimated 값이 없으므로 새로 만들지 않았습니다.
- 실제 또는 예상 시각이 있을 때만 지연·조기 출도착을 계산합니다. 실제 시각이 0분 차이면 On Time, 예정 항공편은 Scheduled, 과거의 미기록 시각은 Actual time not recorded로 표시합니다. 미기록은 0분 지연으로 집계하지 않습니다.
- 목록의 출발일·출발 시간은 출발 공항, 도착 시간은 도착 공항 시간대입니다. 도착일의 `+1`, `+2`는 현지 달력 날짜 차이입니다. 예를 들어 OZ 211의 SFO 출발은 9월 17일, ICN 도착은 9월 19일입니다.
- 시차는 도착 시점에 두 공항의 UTC 오프셋을 비교합니다. DAYS는 브라우저 실행 시점과 출발 공항 현지 날짜를 비교합니다.
- `durationMinutes`는 실제 게이트 출도착이 모두 있을 때 그 차이입니다. 하나라도 없으면 예정 게이트 출도착의 차이를 쓰고 `scheduled`를 붙입니다. 실제 출발과 예정 도착을 섞어 실제 소요 시간으로 표시하지 않습니다.
- `airborneMinutes`는 실제 이륙·착륙이 모두 있는 14편만 계산합니다. 나머지는 `null`입니다. 패스포트 비행시간은 기록된 값만 더하고 기록된 항공편 수를 표시합니다. 기종별 요약·상세의 노선 이력에도 같은 기준을 사용합니다.
- CSV에 거리가 없으므로 `distanceKm`는 공통 모듈에서 외부 공항 좌표의 대권거리로 계산합니다. JSON에는 중복 거리값을 저장하지 않습니다. `distanceSource: "great-circle"`로 구분하고 거리 앞에 ≈를 표시합니다. 실제 비행 경로의 거리가 아닙니다.

## 목록과 상세

`HomePage.vue`는 내 예정 항공편, 친구 예정 항공편, 검색 조건에 맞는 결과를 같은 컬렉션에서 선택합니다. 항공사·편명·노선·날짜 검색도 해당 항공편을 기준으로 수행합니다. 항공편 추가 검색의 항공사·공항 선택지도 현재 컬렉션에서 가져옵니다.

`FlightDetailPage.vue`는 URL의 항공편 ID를 조회합니다. 없는 ID는 안내를 표시합니다. 출도착 게이트·터미널·예약·좌석·기체를 같은 레코드에서 가져오며, 실제 이륙·착륙이 기록되어 있으면 현지 시각을 함께 표시합니다. 미정 기체의 등록 번호는 Not assigned로 표시합니다. 기체 공개 데이터는 아래 방식으로 조회합니다.

예약 편집은 해당 항공편의 `booking` 객체를 갱신합니다. 페이지 이동 후에도 편집값이 유지되고 다른 항공편과 섞이지 않습니다. 새로고침하면 JSON 값으로 초기화합니다.

도착 예측 영역은 같은 항공사·편명의 CSV 기록 중 실제 도착 시각이 있는 항공편만 집계합니다. 기록이 없으면 비율을 —로 표시하고 막대를 숨깁니다. 실시간 예측 데이터는 아닙니다.

## 기체 공개 데이터 조회

`scripts/generate-aircraft-data.mjs`가 항공편 등록번호로 [adsbdb 공개 항공기 데이터](https://github.com/mrjackwills/adsbdb)의 `GET https://api.adsbdb.com/v0/aircraft/{registration}`를 조회해 `src/data/reference/aircraft.json`을 자동 생성합니다. 별도 API 키가 필요하지 않습니다. `src/common/aircraft.js`가 이 스냅샷을 읽으므로 통계와 상세는 처음 열 때부터 같은 기체 정보를 사용합니다. 캐시가 없는 등록번호는 상세의 `loadAircraft`에서도 조회합니다.

- `npm run data:refresh`와 `predev`·`prebuild`는 캐시가 없는 등록번호만 조회합니다. `npm run data:aircraft`는 전체를 다시 조회합니다. 동시에 최대 4개, 요청당 8초 제한이며 네트워크 실패 시 이전 스냅샷을 유지합니다. 404는 `data: null`로 캐시하고 전체 갱신 시 재시도합니다.
- 공개 API는 편명·날짜별 과거 기체 배정을 제공하지 않습니다. 뉴욕 왕복은 위 공개 운항 이력에서 등록번호를 확인했으며 이후 제조사·현재 기종·사진은 API로 자동 연결합니다. 다른 항공편도 등록번호가 있으면 같은 방식으로 보완하고, 등록번호가 없으면 임의로 추정하지 않습니다.

- 상세 페이지의 추가 요청도 같은 등록번호는 화면 세션에서 재사용합니다. `PHBHH → PH-BHH`, `OHLKG → OH-LKG`, `B32LV → B-32LV`처럼 조회용 등록번호 형식을 정리합니다.
- 제조사·현재 기종·ICAO 기종·Mode S·등록 소유자·국가는 응답에서 가져옵니다. 이미지는 `src/assets/Aircraft/{항공사 IATA}/{기종 코드}.png`를 우선 사용하고 로컬 파일이 없는 경우에만 같은 기종의 airport-data.com 사진을 사용합니다. 등록번호 일치는 요구하지 않으며 원격 사진에만 airport-data.com 출처를 표시합니다. 좌석 수·엔진·최초 비행일처럼 응답에 없는 값은 생성하지 않습니다.
- 표시용 기종은 `Boeing 777-300 ER`와 `Boeing 777-300ER`, `Airbus A380`와 `Airbus A380-800`의 표기를 통일합니다. 원본 `aircraft.type`은 그대로 유지합니다. 원본 기종이 비어 있을 때만 현재 공개 등록 정보로 보완합니다.
- 항공편의 `aircraft.type`은 당시 탑승 기록입니다. 외부 데이터는 현재 등록 정보로 별도 표시하며, 소유자를 과거 운항사로 추정하지 않습니다. 패스포트의 기종별 집계도 당시 기록을 사용합니다.
- 등록번호가 없으면 요청하지 않습니다. 조회 중·미등록(404)·통신 실패·10초 제한을 구분하고 항공편 기록을 계속 표시합니다. 사진을 불러오지 못하면 기존 이미지 영역만 유지합니다.

## 항공편 통계

`FlightStatsPage.vue`는 패스포트와 동일하게 내 완료 항공편만 집계합니다. 기간 탭은 실제 기록의 연도에서 만들고 URL의 `period`와 연결합니다. 모든 수치·차트·순위·지도는 같은 기간 배열을 사용합니다.

- 국내선은 출도착 국가 코드가 같은 항공편, 국제선은 다른 항공편입니다. 장거리 항공편은 예정 게이트 출도착 시간이 6시간 이상인 항공편으로 정의했습니다.
- Year는 연속된 연도(기록 없는 해는 0편), Month는 1~12월, Weekday는 출발 공항의 현지 날짜 기준 월~일로 집계합니다. 각 차트의 합계는 선택 기간의 항공편 수와 같습니다.
- 거리 합계·평균 거리·최단 및 최장 항공편은 `distanceKm`로 계산하고 선택한 거리 단위로 표시합니다. 거리 비교는 [NASA의 지구·달 수치](https://science.nasa.gov/moon/by-the-numbers/)를 기준으로 지구 둘레 40,030.2 km, 달 평균 거리 384,400 km, 태양 평균 거리 149,598,262 km를 사용합니다.
- 시간 합계·평균은 실제 이륙·착륙 시각이 있는 항공편만 사용하고 기록 수를 표시합니다. 택싱 시간은 실제 게이트 출도착도 있는 같은 항공편의 게이트 소요 시간에서 공중 비행시간을 뺍니다. 일·주·월·년 환산은 각각 24시간·7일·30일·365일입니다. 미기록은 —입니다.
- 공항은 출도착에 등장한 고유 공항 수이며 항공편 수는 각 공항의 출발 또는 도착을 셉니다. 항공사는 판매 항공사 코드로 묶습니다. 노선은 왕복을 합친 공항 쌍입니다. 항공편 수·거리 탭은 해당 값으로 정렬한 뒤 표시 개수를 적용합니다.
- 국가는 고유 국가·영토 코드 수이며 국가별 항공편 수는 해당 국가에 출발·도착한 편수를 셉니다. 국내선은 같은 국가에 한 번만 셉니다. 지역은 공항의 대륙 코드로 묶은 고유 국가·영토 수와 그 비율입니다.

## 기체·좌석 통계

`AircraftStatsPage.vue`도 동일한 내 완료 항공편과 URL의 `period`를 사용합니다. Total Aircraft는 중복을 제거한 등록번호 수, Aircraft Types는 표시용 기종 수입니다. 가장 자주 탑승한 기종·등록번호·제조사 비중·기종별 비행 횟수와 거리는 선택 기간에서 계산합니다. 비행시간은 실제 이륙·착륙이 기록된 항공편만 더합니다.

좌석 등급·위치·여행 목적의 분모는 선택 기간 전체 항공편이며 빈 값은 Not recorded 행으로 구분합니다. 원형 차트와 요약 막대는 실제 건수에 비례합니다. 선호 좌석은 대소문자를 통일한 좌석 번호의 최다 빈도입니다. 기령·최신/최고령 기체는 제조일이 없으므로 미기록으로 표시하며 가상 수치를 사용하지 않습니다.

## 지연 통계

`DelayStatsPage.vue`는 도착 실제 시각이 있는 항공편만 도착 지연율·최장 지연·항공사별 지연율의 분모로 사용합니다. 공항별 지연율은 출발 실제 시각이 있는 항공편을 출발 공항별로 묶습니다. 실제 시각이 없는 뉴욕 왕복은 항공편 수와 지도에는 포함하고 지연율에서는 제외합니다.

- Lost to Delays는 양수 도착 지연만 더하며 평균은 지연된 항공편만 사용합니다. 누적 도착 실적은 조기 도착의 음수까지 포함한 합계입니다.
- 조기·정시·1~14분·15~29분·30~44분·45분 이상은 겹치지 않는 구간입니다. 항공사와 공항 목록의 `count`는 지연 편수/실제 시각 기록 편수입니다.
- 관측 기록이 없으면 비율과 시간을 —로 표시합니다. 기록된 정시·지연 없음과 구분하며 미래/친구 항공편은 제외합니다.
- 비행·기체·지연·패스포트는 모두 기간 변경을 URL에 반영하며 브라우저 뒤로/앞으로 이동과 지도에도 적용합니다.

`npm run test:stats`는 모든 통계 페이지와 패스포트의 연도별 집계·지도 배열, 미기록 제외, 예약 변경, 뉴욕 기체 정보 연결을 검증합니다.

## 페이지별 지도 경로

- 앞으로의 여정: `HomePage.vue`의 `filteredFlights`를 사용합니다. 현재는 예정 4편의 2개 공항 쌍이며 검색 결과와 함께 바뀝니다.
- 패스포트: `PassportPage.vue`의 `periodFlights`를 사용합니다. ALL-TIME은 지난 28편, 연도를 선택하면 해당 연도의 여정만 표시합니다. 그룹 정렬은 경로 집합을 바꾸지 않습니다.
- 상세: 선택한 항공편 하나를 표시합니다. 목록이 비어 있으면 지도 항로와 공항 마커도 비웁니다.
- 비행·기체·지연 통계: 선택한 기간의 내 완료 항공편을 표시합니다. URL의 `from`·`to`는 이전 화면의 지도 문맥이며 통계 필터로 사용하지 않습니다.

목록 페이지는 `map-flights` 이벤트로 실제 표시 배열을 `MapLayout.vue`에 전달합니다. 동일 공항 쌍은 중복으로 그리지 않고 공항 마커도 코드별로 한 번만 표시합니다. 모든 경로가 보이도록 지도 범위를 맞추고 날짜 변경선 항로도 같은 지구 복사본에 연결합니다.

## 패스포트 정렬

기간 선택은 지난 항공편을 연도로 필터링합니다. 요약·누적 지연·자주 탑승한 기종·이력 건수도 같은 필터 결과를 사용합니다.

`Group past flights`는 `BaseTabItem`의 `type="sort"`, `v-model`, `v-model:order`를 사용합니다.

1. 첫 클릭: 해당 항목으로 묶고 내림차순. 아래 화살표를 표시합니다.
2. 두 번째 클릭: 오름차순. 위 화살표를 표시합니다.
3. 세 번째 클릭: 정렬 항목·화살표를 해제하고 최신 날짜순으로 돌아갑니다.
4. 다른 항목 클릭: 새 항목의 내림차순으로 시작합니다.

Aisle은 좌석 위치, From·To는 출발·도착 공항 코드, Airline은 항공사 이름, Airport는 공항 조합, Tail은 등록 번호, Aircraft는 모델, Flight Time은 실제 비행시간(분)을 사용합니다. 빈 값은 Not recorded로 묶어 정렬 방향과 관계없이 마지막에 둡니다. 그룹 안에서는 최신 출발순이며 그룹 건수는 실제 배열 길이입니다.

## 이미지 자리

항공사 로고는 `src/assets/Airlines/`의 전체 파일을 연결하며 로고 파일이 없는 항공사는 `src/assets/Flags/`의 소속 국가 국기를 사용합니다. 현재 KL은 네덜란드, MU는 중국 국기로 표시합니다. 공항은 공항 국가 코드에 맞는 로컬 국기를 사용합니다. 지연 통계·순위·항공편 목록·상세·검색·패스포트가 이 기준을 함께 사용하며 `BaseIcon`의 `image` 변형으로 원본 색상을 유지합니다. 로고·국기·기체 이미지가 모두 없을 때만 크기와 간격을 유지하고 회색 원·채움 사각형·가짜 로고를 만들지 않습니다.

기체 이미지는 상세·기체 통계·패스포트 모두 항공사와 탑승 기종에 맞는 로컬 파일을 우선 사용합니다. `B787`, `B773`, `A330` 같은 기종군 파일명은 `src/common/aircraft.js`의 대응표에서 연결하며 정확한 기종 코드 파일이 있으면 먼저 사용합니다. A32N 파일은 A321neo 이미지이므로 A320neo에 재사용하지 않습니다. 로컬 파일이 없으면 등록번호와 관계없이 기종 코드가 일치하는 공개 사진만 선택합니다.

## 기준 정보 출처

- 원본 운항·예약·기체: 사용자가 제공한 Flighty CSV. 원본 파일은 수정하지 않았습니다.
- 항공사 IATA·ICAO 대응: [인천국제공항 취항 항공사](https://airinfo.airport.kr/ap_en/1408/subview.do).
- 기존 항공사 ICAO·callsign: [FAA 항공사 식별자](https://www.faa.gov/air_traffic/publications/atpubs/cnt_html/chap3_section_3.html).
- 대한항공 연락처: [공식 서비스센터](https://www.koreanair.com/contents/footer/customer-support/service-center?hl=en). SNS: [대한항공·JAL 공동 발표](https://press.jal.co.jp/en/release/202609/009703.html).
- 아시아나 연락처: [공식 전화 예약 안내](https://flyasiana.com/C/KR/KO/contents/telephone-reservation?site_preference=normal). X: [공식 계정](https://x.com/Flyasiana/with_replies). Facebook: [Star Alliance 소개](https://portal.staralliance.com/stardesk/publications/In_Focus.pdf).
- 공항 코드·위치·시간대와 항공사 코드: 무료 공개 패키지에서 생성합니다. [다국어·단위·데이터 가이드](localization-units-data.md)에 출처·라이선스·갱신 방법과 보완 필드를 정리했습니다.
