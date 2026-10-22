import airlineData from "../data/reference/airlines.json";
import airlineDetails from "../data/airline-details.json";
import { t } from "./preferences.js";
import koreanAirLogo from "../assets/figma/korean-air.svg";
import asianaLogo from "../assets/Airlines/Logo-OZ.svg";
import finnairLogo from "../assets/Airlines/Logo-AY.svg";
import alaskaLogo from "../assets/Airlines/Logo-AS.svg";
import singaporeAirlinesLogo from "../assets/Airlines/Logo-SQ.svg";
import jinAirLogo from "../assets/Airlines/Logo-LJ.svg";
import jejuAirLogo from "../assets/Airlines/Logo-7C.svg";

// JSON에는 파일명만 두고 실제 이미지 경로는 기존 에셋 import로 연결합니다.
const logos = {
    "korean-air.svg": koreanAirLogo,
    "Logo-OZ.svg": asianaLogo,
    "Logo-AY.svg": finnairLogo,
    "Logo-AS.svg": alaskaLogo,
    "Logo-SQ.svg": singaporeAirlinesLogo,
    "Logo-LJ.svg": jinAirLogo,
    "Logo-7C.svg": jejuAirLogo,
};
const defaultAirlineLogo = "";
const airlines = Object.fromEntries(
    Object.entries(airlineData).map(([code, airline]) => [
        code,
        {
            ...airline,
            ...airlineDetails[code],
            sourceName: airline.name,
            logo: logos[airlineDetails[code]?.logo] || defaultAirlineLogo,
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
        )
    );
}

export { defaultAirlineLogo };
export default airlines;
