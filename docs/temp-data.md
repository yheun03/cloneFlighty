# 임시 항공편 데이터

목록, 상세, 패스포트, 항공편 검색은 `src/data/temp/`의 데이터를 함께 사용합니다. 항공편 일정·지연·예약 코드·좌석·기체 상세 사양은 화면 검증용 가상 데이터입니다. 항공사·공항 기준 정보와 가상 운항 정보를 구분해 수정합니다.

## 파일과 연결 기준

- `airlines.json`: IATA 코드가 키입니다. 대한항공·아시아나의 IATA, ICAO, ATC callsign, 국가, 동맹, 국내·국제 전화번호, 공식 홈페이지·X·Facebook, 확인 출처를 관리합니다. 다른 항공사는 기존 통계 예시에 필요한 기본 정보만 포함합니다.
- `airports.json`: IATA 코드가 키입니다. 공항명, ICAO, 도시, 국가·국가 코드, 국기, 위도·경도, IANA 시간대, 참고 출처를 관리합니다.
- `aircraft.json`: 기체 ID가 키입니다. 운항사, 등록 번호, 제작사, 모델, ICAO 기종 코드, 최초 비행일, 좌석 수, 엔진, 이미지 파일명을 관리합니다. 기체별 값은 `isSample: true`인 임시 예시이며 실제 등록 기체의 이력·사양을 보증하지 않습니다.
- `flights.json`: 고유 `id`가 있는 항공편 배열입니다. `airline`으로 항공사를, `aircraftId`로 기체를, `departure.airport`와 `arrival.airport`로 공항을 연결합니다. `friend`가 있으면 친구 항공편, `status: "completed"`이면 지난 항공편입니다.

연결은 `src/common/flights.js`에서 처리합니다. 새 기체나 항공편을 추가할 때 항공사·공항·기체 키가 먼저 존재해야 합니다. 컴포넌트에는 표시할 항목만 props로 전달하고, HTML 속성으로 원본 객체 전체를 전달하지 않습니다.

## 날짜와 시간

`scheduledAt`, `estimatedAt`, `actualAt`은 UTC 오프셋이 포함된 ISO 날짜로 저장합니다. 표시 시간은 `actualAt → estimatedAt → scheduledAt` 순서로 결정합니다.

```json
{
    "airport": "SFO",
    "scheduledAt": "2026-11-28T11:20:00-08:00",
    "estimatedAt": "2026-11-28T11:40:00-08:00",
    "terminal": "Terminal 1",
    "gate": "F4"
}
```

- 지연·조기 도착은 표시 시각과 예정 시각의 차이를 분 단위로 계산합니다. 0분이면 On Time입니다.
- 목록의 출발일·출발 시간은 출발 공항 시간대, 도착 시간은 도착 공항 시간대를 사용합니다.
- 도착일의 `+1` 등은 양쪽 공항의 현지 달력 날짜를 비교한 결과입니다.
- 시차는 도착 시점의 두 공항 UTC 오프셋을 비교합니다. 예시 SFO → ICN은 겨울 +17시간, 여름 +16시간입니다. 공항의 `timeZone`에는 `America/Los_Angeles`, `Asia/Seoul` 같은 IANA 이름을 사용합니다.
- `durationMinutes`는 출도착 시각 차이, `airborneMinutes`는 택싱을 제외한 샘플 비행시간입니다. 정렬의 Flight Time은 `airborneMinutes`를 사용합니다.
- DAYS는 브라우저 실행 시점과 출발 공항의 현지 날짜를 기준으로 계산합니다. `flights.json`의 `referenceDate`는 샘플 제작 기준일이며 시간을 고정하지 않습니다.

## 목록과 상세

`HomePage.vue`는 내 예정 항공편, 친구 예정 항공편, 검색 조건에 맞는 결과를 같은 컬렉션에서 선택합니다. 항공사·편명·노선·날짜 검색도 해당 항공편을 기준으로 수행합니다.

`FlightDetailPage.vue`는 URL의 항공편 ID를 조회합니다. `ke-24`와 `ke-24-2`는 날짜, 지연, 예약 코드, 좌석, 연결된 기체가 서로 다른 항공편입니다. 없는 ID는 임의의 다른 항공편으로 대체하지 않고 안내를 표시합니다. 상세 지도는 URL의 출도착 검색 조건보다 항공편 자체의 공항을 우선합니다. 목록 지도는 아래의 페이지별 항공편 배열을 사용합니다.

예약 편집은 해당 항공편의 `booking` 객체를 갱신합니다. 다른 페이지로 이동해도 편집값이 유지되고, 다른 항공편의 예약 정보와 섞이지 않습니다. 새로고침하면 JSON 값으로 초기화합니다.

도착 예측 차트는 같은 항공사·편명의 지난 임시 항공편에서 집계합니다. 관측값이 없으면 0으로 표시하며, 실제 운항 예측이나 최근 60일 실적으로 표시하지 않습니다.

## 페이지별 지도 경로

- 앞으로의 여정: `HomePage.vue`의 `filteredFlights`를 사용합니다. 내 예정 항공편·친구 예정 항공편·검색 결과와 지도 항로가 함께 바뀝니다.
- 패스포트: `PassportPage.vue`의 `periodFlights`를 사용합니다. ALL-TIME은 내 모든 완료 항공편, 연도를 선택하면 해당 연도의 여정만 표시합니다. 그룹 정렬은 경로 집합을 바꾸지 않습니다.
- 상세: 선택한 항공편 하나를 표시합니다. 목록이 비어 있으면 지도 항로와 공항 마커도 비웁니다.

두 목록 페이지는 `map-flights` 이벤트로 실제 표시할 배열을 `MapLayout.vue`에 전달합니다. 지도에서 별도의 검색·기간 필터를 복제하지 않습니다. 동일 공항 쌍은 중복으로 그리지 않고 항공편 ID 목록을 함께 보관합니다. 공항 마커도 공항 코드별로 한 번만 표시하며, 모든 경로가 보이도록 지도 범위를 맞춥니다. 날짜 변경선을 지나는 항로는 같은 지구 복사본의 경도에 맞춰 연결합니다.

## 패스포트 정렬

기간 선택은 내 완료 항공편을 연도로 필터링합니다. 요약·누적 지연·자주 탑승한 기종·이력 건수도 같은 필터 결과를 사용합니다.

`Group past flights`는 `BaseTabItem`의 `type="sort"`, `v-model`, `v-model:order`를 사용합니다.

1. 첫 클릭: 해당 항목으로 묶고 내림차순으로 정렬합니다. 아래 화살표를 표시합니다.
2. 같은 항목을 두 번째 클릭: 오름차순으로 정렬합니다. 위 화살표를 표시합니다.
3. 세 번째 클릭: 항목과 화살표를 해제하고 최신 날짜순으로 돌아갑니다.
4. 다른 항목 클릭: 새 항목의 내림차순으로 시작합니다.

Aisle은 좌석 위치, From·To는 각각 출발·도착 공항 코드, Airline은 항공사 이름, Airport는 출도착 공항 조합, Tail은 기체 등록 번호, Aircraft는 모델, Flight Time은 숫자 분을 기준으로 합니다. 같은 그룹 안에서는 최신 출발 시각순을 유지합니다. 기본 날짜순은 연도별로 묶습니다. 각 그룹의 건수는 실제 배열 길이입니다.

## 이미지 자리

이미지·로고가 없으면 크기와 간격만 유지합니다. 회색 원·채움 사각형·가짜 로고를 만들지 않습니다. 실제 에셋이 있으면 기존 이미지와 아이콘을 표시합니다. JSON 이미지 파일명은 공통 모듈에서 기존 에셋 import로 연결하며 외부 임시 이미지 URL을 런타임에 사용하지 않습니다.

## 기준 정보 출처

- 항공사 ICAO·callsign: [FAA 항공사 식별자](https://www.faa.gov/air_traffic/publications/atpubs/cnt_html/chap3_section_3.html).
- 대한항공 연락처: [공식 서비스센터](https://www.koreanair.com/contents/footer/customer-support/service-center?hl=en). SNS 주소: [대한항공·JAL 공동 발표](https://press.jal.co.jp/en/release/202609/009703.html).
- 아시아나 연락처: [공식 전화 예약 안내](https://flyasiana.com/C/KR/KO/contents/telephone-reservation?site_preference=normal). X: [공식 계정](https://x.com/Flyasiana/with_replies). Facebook: [Star Alliance 공식 소개](https://portal.staralliance.com/stardesk/publications/In_Focus.pdf).
- 공항 코드·위치 참고: [OurAirports 데이터 설명](https://ourairports.com/help/data-dictionary.html). 개별 참고 페이지는 각 공항의 `source`에 있습니다. 기존 프로젝트 좌표를 유지했습니다.

연락처·SNS·동맹 정보는 변경될 수 있으므로 실서비스에 적용할 때 JSON의 출처를 기준으로 갱신합니다.
