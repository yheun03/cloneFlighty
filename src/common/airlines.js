import defaultAirlineLogo from "../assets/icons/lucide/circle.svg";

const airlines = {
    KE: {
        name: "Korean Air",
        iata: "KE",
        icao: "KAL",
        callsign: "KOREANAIR",
        alliance: "SkyTeam",
        logo: defaultAirlineLogo,
    },
    OZ: {
        name: "Asiana",
        iata: "OZ",
        logo: defaultAirlineLogo,
    },
    KL: {
        name: "KLM",
        iata: "KL",
        logo: defaultAirlineLogo,
    },
    AY: {
        name: "Finnair",
        iata: "AY",
        logo: defaultAirlineLogo,
    },
    AS: {
        name: "Alaska",
        iata: "AS",
        logo: defaultAirlineLogo,
    },
    SQ: {
        name: "Singapore Airlines",
        iata: "SQ",
        logo: defaultAirlineLogo,
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
