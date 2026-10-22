import { reactive } from "vue";
import aircraftData from "../data/reference/aircraft.json";

const aircraftImages = import.meta.glob("../assets/Aircraft/*/*.png", {
    eager: true,
    query: "?url",
    import: "default",
});

// 정확한 기종 코드를 먼저 찾고, 폴더에서 사용하는 기종군 이름을 이어서 확인합니다.
// A32N 파일은 A321neo 이미지이므로 A320neo에는 사용하지 않습니다.
const aircraftImageCodes = {
    "Airbus A220-300": ["BCS3", "A220"],
    "Airbus A320neo": ["A20N"],
    "Airbus A321": ["A321"],
    "Airbus A321neo": ["A21N", "A32N"],
    "Airbus A330-300": ["A333", "A330"],
    "Airbus A350-900": ["A359"],
    "Airbus A380-800": ["A388"],
    "Boeing 737-800": ["B738", "B737"],
    "Boeing 737-900": ["B739", "B737"],
    "Boeing 747-8": ["B748", "B747"],
    "Boeing 767-300": ["B763", "B767"],
    "Boeing 777-200ER": ["B772"],
    "Boeing 777-300": ["B773"],
    "Boeing 777-300ER": ["B77W", "B773"],
    "Boeing 787-9": ["B789", "B787"],
    "Embraer 175": ["E75L", "E175"],
    "Embraer 190": ["E190"],
};

// 공개 기체 데이터: https://github.com/mrjackwills/adsbdb
// 생성된 스냅샷을 먼저 사용하고 캐시가 없는 등록번호만 조회합니다.
export const aircraft = reactive(
    Object.fromEntries(
        Object.entries(aircraftData).map(([registration, record]) => [
            registration,
            { ...record, status: record.data ? "loaded" : "not-found" },
        ]),
    ),
);

export function getAircraftImages(airline, model, lookup) {
    const registry = lookup?.data;
    const codes =
        aircraftImageCodes[model] ||
        (registry && model === `${registry.manufacturer} ${registry.type}`
            ? [registry.icao_type]
            : [model]);
    const localImage = codes
        .map(
            (code) =>
                aircraftImages[`../assets/Aircraft/${airline}/${code}.png`],
        )
        .find(Boolean);
    if (localImage) {
        return {
            image: localImage,
            passportImage: localImage,
            imageSource: "",
            imageIsLocal: true,
        };
    }

    // 등록번호가 달라도 같은 기종의 공개 사진을 사용할 수 있습니다.
    // 현재 등록 정보의 기종이 탑승 기록과 다르면 그 사진은 선택하지 않습니다.
    const photo = [lookup, ...Object.values(aircraft)].find(
        (record) =>
            codes[0] &&
            record?.data?.icao_type === codes[0] &&
            record.data.url_photo,
    )?.data;
    return {
        image: photo?.url_photo || "",
        passportImage: photo?.url_photo_thumbnail || photo?.url_photo || "",
        imageSource: photo?.url_photo || "",
        imageIsLocal: false,
    };
}

export function normalizeRegistration(value) {
    const registration = String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "");
    return registration.includes("-")
        ? registration
        : registration.replace(/^(PH|OH|B)(?=[A-Z0-9])/, "$1-");
}

export async function loadAircraft(value) {
    const registration = normalizeRegistration(value);
    if (!registration || aircraft[registration]) return;

    const source = `https://api.adsbdb.com/v0/aircraft/${encodeURIComponent(registration)}`;
    aircraft[registration] = { status: "loading", data: null, source };
    try {
        const response = await fetch(source, {
            signal: AbortSignal.timeout(10000),
        });
        if (response.status === 404) {
            aircraft[registration] = {
                status: "not-found",
                data: null,
                source,
            };
            return;
        }
        if (!response.ok)
            throw new Error(`Aircraft lookup: ${response.status}`);
        const body = await response.json();
        const data = body.response?.aircraft;
        if (
            !data ||
            normalizeRegistration(data.registration) !== registration
        ) {
            throw new Error("Aircraft registration does not match");
        }
        aircraft[registration] = { status: "loaded", data, source };
    } catch {
        aircraft[registration] = { status: "unavailable", data: null, source };
    }
}
