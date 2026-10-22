# 공개 항공 기준 정보 (생성 결과)

`npm run data:refresh`로 생성합니다. 직접 편집하지 않습니다.

- `airports.json`: [Aashish Vanand / airport-data-js](https://github.com/aashishvanand/airport-data-js), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- `airlines.json`: [OpenFlights](https://openflights.org/data.php), [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/) / DbCL. 원본을 제공하는 [airline-codes](https://github.com/npow/airline-codes) 패키지 코드의 ISC와 데이터 라이선스를 구분합니다. 이 항공사 파생 데이터베이스도 ODbL로 제공합니다.
- `aircraft.json`: [adsbdb 공개 API](https://github.com/mrjackwills/adsbdb)의 등록번호별 응답 스냅샷입니다. `data`·`source`·`fetchedAt`을 저장하며 404는 `data: null`입니다. `npm run data:refresh`는 캐시가 없는 번호만 조회하고 `npm run data:aircraft`는 전체를 갱신합니다. 사진은 airport-data.com 출처를 표시합니다. 원본 항공편의 과거 기종은 수정하지 않습니다.

변경 사항: 프로젝트에서 필요한 IATA 코드만 추림, 필드명 정리, 항공사 `\N`을 null로 변환, 활성 여객 항공사 선택. 공항의 화면용 도시명은 `airport-display.json`에서 보완합니다. 원본 공항 좌표·시간대와 항공사 코드는 유지합니다.

설정·단위·갱신 절차는 [다국어·단위·데이터 가이드](../../../docs/localization-units-data.md)를 참고합니다.
