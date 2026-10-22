import airportData from "../data/reference/airports.json";
import { countryName, t } from "./preferences.js";

const airports = Object.fromEntries(
    Object.entries(airportData).map(([code, airport]) => [
        code,
        {
            ...airport,
            sourceName: airport.fullName,
            flag: [...airport.countryCode]
                .map((letter) =>
                    String.fromCodePoint(127397 + letter.charCodeAt(0)),
                )
                .join(""),
            get name() {
                return t(airport.fullName);
            },
            get fullName() {
                return t(airport.fullName);
            },
            get city() {
                return t(airport.city);
            },
            get country() {
                return countryName(airport.countryCode);
            },
        },
    ]),
);

export default airports;
