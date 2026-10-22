import { reactive } from "vue";

// 공개 기체 데이터: https://github.com/mrjackwills/adsbdb
// 선택한 기체만 조회하고 같은 등록번호는 새로고침 전까지 재사용합니다.
export const aircraft = reactive({});

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
