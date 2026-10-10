import defaultAirlineLogo from "../assets/icons/lucide/circle.svg";
import koreanAirLogo from "../assets/Airlines/Logo-KE.svg";
import asianaLogo from "../assets/Airlines/Logo-OZ.svg";
import finnairLogo from "../assets/Airlines/Logo-AY.svg";
import alaskaLogo from "../assets/Airlines/Logo-AS.svg";
import singaporeAirlinesLogo from "../assets/Airlines/Logo-SQ.svg";

const airlines = {
    KE: {
        name: "Korean Air",
        iata: "KE",
        icao: "KAL",
        callsign: "KOREANAIR",
        alliance: "SkyTeam",
        logo: koreanAirLogo,
    },
    OZ: {
        name: "Asiana",
        iata: "OZ",
        logo: asianaLogo,
    },
    KL: {
        name: "KLM",
        iata: "KL",
        logo: defaultAirlineLogo,
    },
    AY: {
        name: "Finnair",
        iata: "AY",
        logo: finnairLogo,
    },
    AS: {
        name: "Alaska",
        iata: "AS",
        logo: alaskaLogo,
    },
    SQ: {
        name: "Singapore Airlines",
        iata: "SQ",
        logo: singaporeAirlinesLogo,
    },
};

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
