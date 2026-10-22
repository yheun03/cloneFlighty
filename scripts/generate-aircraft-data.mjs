import fs from "node:fs/promises";

// 무료 공개 등록 정보만 보완합니다. 원본 항공편·예약·당시 기종은 수정하지 않습니다.
const root = new URL("../", import.meta.url);
const file = new URL("src/data/reference/aircraft.json", root);
const { flights } = JSON.parse(
    await fs.readFile(new URL("src/data/temp/flights.json", root), "utf8"),
);
const cache = JSON.parse(await fs.readFile(file, "utf8"));
const normalize = (value) => {
    const registration = String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "");
    return registration.includes("-")
        ? registration
        : registration.replace(/^(PH|OH|B)(?=[A-Z0-9])/, "$1-");
};
const registrations = [
    ...new Set(
        flights
            .map((flight) => normalize(flight.aircraft.registration))
            .filter(Boolean),
    ),
].sort();
const pending = registrations.filter(
    (registration) =>
        process.argv.includes("--refresh") || !cache[registration],
);

// 동시에 최대 4개를 요청하고, 통신 실패 시 이전 스냅샷을 유지합니다.
for (let index = 0; index < pending.length; index += 4) {
    await Promise.all(
        pending.slice(index, index + 4).map(async (registration) => {
            const source = `https://api.adsbdb.com/v0/aircraft/${encodeURIComponent(registration)}`;
            try {
                const response = await fetch(source, {
                    signal: AbortSignal.timeout(8000),
                });
                if (response.status === 404) {
                    cache[registration] = {
                        data: null,
                        source,
                        fetchedAt: new Date().toISOString(),
                    };
                    return;
                }
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const body = await response.json();
                const data = body.response?.aircraft;
                if (!data || normalize(data.registration) !== registration)
                    throw new Error("Registration mismatch");
                cache[registration] = {
                    data,
                    source,
                    fetchedAt: new Date().toISOString(),
                };
            } catch (error) {
                console.warn(
                    `Aircraft ${registration}: ${error.message}; keeping existing data.`,
                );
            }
        }),
    );
}
const result = Object.fromEntries(
    registrations
        .filter((registration) => cache[registration])
        .map((registration) => [registration, cache[registration]]),
);
await fs.writeFile(file, `${JSON.stringify(result, null, 4)}\n`);
console.log(
    `Public aircraft data: ${Object.values(result).filter((record) => record.data).length}/${registrations.length} found, ${Object.values(result).filter((record) => !record.data).length} not found`,
);
