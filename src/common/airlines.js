import airlineData from "../data/reference/airlines.json";
import airlineDetails from "../data/airline-details.json";
import { t } from "./preferences.js";
import { getCountryFlag } from "./countries.js";
import koreanAirLogo from "../assets/figma/korean-air.svg";

// 항공사 로고를 모두 연결하고, 로고가 없는 항공사는 소속 국가의 국기를 사용합니다.
const logos = {
    ...Object.fromEntries(
        Object.entries(
            import.meta.glob("../assets/Airlines/*.svg", {
                eager: true,
                query: "?url",
                import: "default",
            }),
        ).map(([path, image]) => [path.split("/").at(-1), image]),
    ),
    "korean-air.svg": koreanAirLogo,
};
const defaultAirlineLogo = "";
const airlines = Object.fromEntries(
    Object.entries(airlineData).map(([code, airline]) => [
        code,
        {
            ...airline,
            ...airlineDetails[code],
            sourceName: airline.name,
            logo:
                logos[airlineDetails[code]?.logo] ||
                logos[`Logo-${code}.svg`] ||
                getCountryFlag(airline.country),
            get name() {
                return t(airline.name);
            },
        },
    ]),
);

export function getAirline(value) {
    const normalized = String(value || "")
        .trim()
        .toUpperCase();

    return (
        airlines[normalized.split(" ")[0]] ||
        Object.values(airlines).find(
            (airline) =>
                airline.icao === normalized ||
                airline.callsign?.toUpperCase() === normalized ||
                airline.name.toUpperCase() ===
                    String(value || "")
                        .trim()
                        .toUpperCase() ||
                airline.sourceName.toUpperCase() ===
                    String(value || "")
                        .trim()
                        .toUpperCase(),
        ) ||
        (logos[`Logo-${normalized.split(" ")[0]}.svg`]
            ? {
                  iata: normalized.split(" ")[0],
                  logo: logos[`Logo-${normalized.split(" ")[0]}.svg`],
              }
            : undefined)
    );
}

export { defaultAirlineLogo };
export default airlines;
