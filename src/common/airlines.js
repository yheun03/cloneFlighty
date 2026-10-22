import airlineData from "../data/temp/airlines.json";
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
        { ...airline, logo: logos[airline.logo] || defaultAirlineLogo },
    ]),
);

export function getAirline(value) {
    const normalized = String(value || "")
        .trim()
        .toUpperCase()
        .split(" ")[0];

    return (
        airlines[normalized] ||
        Object.values(airlines).find(
            (airline) =>
                airline.icao === normalized ||
                airline.callsign === normalized ||
                airline.name.toUpperCase() ===
                    String(value || "")
                        .trim()
                        .toUpperCase(),
        )
    );
}

export { defaultAirlineLogo };
export default airlines;
