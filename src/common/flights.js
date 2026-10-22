import { computed, reactive } from "vue";

import flightData from "../data/temp/flights.json";
import airlines from "./airlines.js";
import airports from "./airports.js";
import {
    aircraft,
    normalizeRegistration,
    getAircraftImages,
} from "./aircraft.js";
import { locale, t, formatDuration } from "./preferences.js";
export { formatDuration } from "./preferences.js";

// 목록·상세·패스포트가 같은 항공편과 예약 정보를 참조합니다.
// 화면 편집만 반응형으로 유지하며 새로고침하면 JSON 값으로 초기화합니다.
const records = reactive(flightData.flights);

function formatDate(value, timeZone, options) {
    return new Intl.DateTimeFormat(locale.value, {
        timeZone,
        ...options,
    }).format(new Date(value));
}

function localDate(value, timeZone) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date(value));
    const values = Object.fromEntries(
        parts.map((part) => [part.type, part.value]),
    );
    return `${values.year}-${values.month}-${values.day}`;
}

function timeZoneOffset(value, timeZone) {
    const offset = new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "shortOffset",
    })
        .formatToParts(new Date(value))
        .find((part) => part.type === "timeZoneName").value;
    const match = offset.match(/GMT([+-])(\d+)(?::(\d+))?/);
    return match
        ? (Number(match[2]) * 60 + Number(match[3] || 0)) *
              (match[1] === "+" ? 1 : -1)
        : 0;
}

function timingStatus(minutes) {
    if (minutes === null) return t("Not recorded");
    if (minutes === 0) return t("On Time");
    return t(minutes > 0 ? "{duration} Late" : "{duration} Early", {
        duration: formatDuration(Math.abs(minutes)),
    });
}

function joinFlight(record) {
    const airlineInfo = airlines[record.airline];
    const departureAirport = airports[record.departure.airport];
    const arrivalAirport = airports[record.arrival.airport];
    // 거리 기준값은 외부 데이터셋 좌표에서 계산한 km이며, 단위는 표시할 때 변환합니다.
    const radians = (degrees) => (degrees * Math.PI) / 180;
    const lat1 = radians(departureAirport.lat);
    const lat2 = radians(arrivalAirport.lat);
    const h =
        Math.sin((lat2 - lat1) / 2) ** 2 +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(radians(arrivalAirport.lng - departureAirport.lng) / 2) **
                2;
    const distanceKm = Math.round(
        6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h))),
    );
    const aircraftLookup =
        aircraft[normalizeRegistration(record.aircraft.registration)];
    const aircraftModel =
        (
            record.aircraft.type ||
            (aircraftLookup?.data
                ? `${aircraftLookup.data.manufacturer} ${aircraftLookup.data.type}`
                : "")
        )
            .replace(/\s+ER$/, "ER")
            .replace(/^Airbus A380$/, "Airbus A380-800") || null;
    const departureAt =
        record.departure.actualAt ||
        record.departure.estimatedAt ||
        record.departure.scheduledAt;
    const arrivalAt =
        record.arrival.actualAt ||
        record.arrival.estimatedAt ||
        record.arrival.scheduledAt;
    const departureDate = localDate(departureAt, departureAirport.timeZone);
    const arrivalDate = localDate(arrivalAt, arrivalAirport.timeZone);
    const dayOffset = Math.round(
        (Date.parse(arrivalDate) - Date.parse(departureDate)) / 86400000,
    );
    const departureObservedAt =
        record.departure.actualAt || record.departure.estimatedAt;
    const arrivalObservedAt =
        record.arrival.actualAt || record.arrival.estimatedAt;
    const departureDelayMinutes = departureObservedAt
        ? Math.round(
              (Date.parse(departureAt) -
                  Date.parse(record.departure.scheduledAt)) /
                  60000,
          )
        : null;
    const arrivalDelayMinutes = arrivalObservedAt
        ? Math.round(
              (Date.parse(arrivalAt) - Date.parse(record.arrival.scheduledAt)) /
                  60000,
          )
        : null;
    // 실제 출도착이 모두 있어야 실제 소요 시간을 계산합니다.
    const hasActualDuration = Boolean(
        record.departure.actualAt && record.arrival.actualAt,
    );
    const durationMinutes = Math.round(
        (Date.parse(
            hasActualDuration
                ? record.arrival.actualAt
                : record.arrival.scheduledAt,
        ) -
            Date.parse(
                hasActualDuration
                    ? record.departure.actualAt
                    : record.departure.scheduledAt,
            )) /
            60000,
    );
    const airborneMinutes =
        record.departure.takeoffActualAt && record.arrival.landingActualAt
            ? Math.round(
                  (Date.parse(record.arrival.landingActualAt) -
                      Date.parse(record.departure.takeoffActualAt)) /
                      60000,
              )
            : null;
    const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    };
    const departureTime = formatDate(
        departureAt,
        departureAirport.timeZone,
        timeOptions,
    );
    const arrivalTime = formatDate(
        arrivalAt,
        arrivalAirport.timeZone,
        timeOptions,
    );

    return {
        ...record,
        distanceKm,
        airlineInfo,
        departureAirport,
        arrivalAirport,
        aircraft: {
            ...record.aircraft,
            // 과거 탑승 기종은 항공편 기록을 유지하고 현재 등록 정보는 별도로 둡니다.
            model: aircraftModel,
            lookup: aircraftLookup,
            ...getAircraftImages(record.airline, aircraftModel, aircraftLookup),
        },
        departureInfo: record.departure,
        arrivalInfo: record.arrival,
        from: departureAirport.iata,
        to: arrivalAirport.iata,
        flight: record.number,
        title: t("{from} to {to}", {
            from: departureAirport.city,
            to: arrivalAirport.city,
        }),
        date: formatDate(departureAt, departureAirport.timeZone, {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        departure: `${departureAirport.iata} ${departureTime}`,
        arrival: `${arrivalAirport.iata} ${arrivalTime}${dayOffset > 0 ? ` (+${dayOffset})` : dayOffset < 0 ? ` (${dayOffset})` : ""}`,
        departureAt,
        arrivalAt,
        departureDate,
        year: departureDate.slice(0, 4),
        departureTime,
        arrivalTime,
        scheduledDeparture: formatDate(
            record.departure.scheduledAt,
            departureAirport.timeZone,
            timeOptions,
        ),
        scheduledArrival: formatDate(
            record.arrival.scheduledAt,
            arrivalAirport.timeZone,
            timeOptions,
        ),
        arrivalDayOffset:
            dayOffset > 0
                ? `+${dayOffset}`
                : dayOffset < 0
                  ? String(dayOffset)
                  : "",
        departureDelayMinutes,
        arrivalDelayMinutes,
        departureStatus: departureObservedAt
            ? timingStatus(departureDelayMinutes)
            : record.status === "upcoming"
              ? t("Scheduled")
              : t("Actual time not recorded"),
        arrivalStatus: arrivalObservedAt
            ? timingStatus(arrivalDelayMinutes)
            : record.status === "upcoming"
              ? t("Scheduled")
              : t("Actual time not recorded"),
        durationMinutes,
        duration: hasActualDuration
            ? formatDuration(durationMinutes)
            : t("{duration} scheduled", {
                  duration: formatDuration(durationMinutes),
              }),
        airborneMinutes,
        flightTime:
            airborneMinutes === null ? "" : formatDuration(airborneMinutes),
        days: Math.max(
            0,
            Math.round(
                (Date.parse(departureDate) -
                    Date.parse(
                        localDate(Date.now(), departureAirport.timeZone),
                    )) /
                    86400000,
            ),
        ),
        timezoneChangeMinutes:
            timeZoneOffset(arrivalAt, arrivalAirport.timeZone) -
            timeZoneOffset(arrivalAt, departureAirport.timeZone),
        arrivalAtOriginTime: formatDate(
            arrivalAt,
            departureAirport.timeZone,
            timeOptions,
        ),
        type: record.friend ? "friend" : "default",
        profile: record.friend?.profile || "",
        isCompleted: record.status === "completed",
    };
}

export const flights = computed(() => records.map(joinFlight));

export function getFlight(id) {
    return flights.value.find((flight) => flight.id === id);
}
