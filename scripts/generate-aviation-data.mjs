import fs from "node:fs/promises";
import { createRequire } from "node:module";
import airportData from "airport-data-js";

const require = createRequire(import.meta.url);
const airlineData = require("airline-codes/airlines.json");
const root = new URL("../", import.meta.url);
const read = async (path) =>
    JSON.parse(await fs.readFile(new URL(path, root), "utf8"));
const flights = (await read("src/data/temp/flights.json")).flights;
const display = await read("src/data/airport-display.json");
const details = await read("src/data/airline-details.json");
const airportCodes = new Set([
    ...Object.keys(display),
    ...flights.flatMap((flight) => [
        flight.departure.airport,
        flight.arrival.airport,
    ]),
]);
const airlineCodes = new Set([
    ...Object.keys(details),
    ...flights.map((flight) => flight.airline),
]);
const airports = {};
for (const code of [...airportCodes].sort()) {
    const matches = await airportData.getAirportByIata(code);
    const source =
        matches.find((row) => row.type === "large_airport") || matches[0];
    if (
        !source?.time ||
        !Number.isFinite(source.latitude) ||
        !Number.isFinite(source.longitude)
    ) {
        throw new Error(`Airport data is incomplete: ${code}`);
    }
    new Intl.DateTimeFormat("en-US", { timeZone: source.time }).format(0);
    airports[code] = {
        iata: source.iata,
        icao: source.icao,
        fullName: source.airport,
        city: display[code]?.city || source.airport,
        lat: source.latitude,
        lng: source.longitude,
        elevationFt: source.elevation_ft,
        timeZone: source.time,
        countryCode: source.country_code,
        continent: source.continent,
        website: source.website,
        source: "https://github.com/aashishvanand/airport-data-js",
    };
}
const airlines = {};
for (const code of [...airlineCodes].sort()) {
    const matches = airlineData.filter(
        (row) =>
            row.iata === code && row.active === "Y" && !/Cargo/i.test(row.name),
    );
    if (matches.length !== 1)
        throw new Error(
            `Airline code needs an unambiguous active passenger record: ${code}`,
        );
    const source = matches[0];
    airlines[code] = {
        name: source.name,
        iata: source.iata,
        icao: source.icao === "\\N" ? null : source.icao,
        // 공개 패키지의 AS callsign 'Inc.'처럼 호출부호가 아닌 값은 표시하지 않습니다.
        callsign: /^[a-z\d -]+$/i.test(source.callsign)
            ? source.callsign
            : null,
        country: source.country,
        source: "https://openflights.org/data.php",
    };
}
await fs.mkdir(new URL("src/data/reference/", root), { recursive: true });
for (const [name, value] of Object.entries({ airports, airlines })) {
    await fs.writeFile(
        new URL(`src/data/reference/${name}.json`, root),
        `${JSON.stringify(value, null, 4)}\n`,
    );
}
console.log(
    `Public aviation data: ${airportCodes.size} airports, ${airlineCodes.size} airlines`,
);
