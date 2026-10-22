import assert from "node:assert/strict";
import fs from "node:fs";
import { after, test } from "node:test";
import { createServer } from "vite";
import { createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import { createRouter, createMemoryHistory } from "vue-router";

const server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    appType: "custom",
});
after(() => server.close());
const { flights, getFlight } = await server.ssrLoadModule(
    "/src/common/flights.js",
);
const { t, preferences } = await server.ssrLoadModule(
    "/src/common/preferences.js",
);
preferences.language = "en";
const source = JSON.parse(
    fs.readFileSync(
        new URL("../src/data/temp/flights.json", import.meta.url),
        "utf8",
    ),
);
const cache = JSON.parse(
    fs.readFileSync(
        new URL("../src/data/reference/aircraft.json", import.meta.url),
        "utf8",
    ),
);
const pages = {};
for (const name of [
    "FlightStatsPage",
    "AircraftStatsPage",
    "DelayStatsPage",
    "PassportPage",
    "FlightDetailPage",
]) {
    pages[name] = (
        await server.ssrLoadModule(`/src/pages/${name}.vue`)
    ).default;
}

async function render(name, period = "ALL-TIME", id) {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: "/home", name: "home", component: pages[name] },
            {
                path: "/passport",
                name: "passport",
                component: pages.PassportPage,
            },
            {
                path: "/stats/flights",
                name: "flight-stats",
                component: pages.FlightStatsPage,
            },
            {
                path: "/stats/aircraft",
                name: "aircraft-stats",
                component: pages.AircraftStatsPage,
            },
            {
                path: "/stats/delays",
                name: "delay-stats",
                component: pages.DelayStatsPage,
            },
            {
                path: "/flight/:id",
                name: "flight-detail",
                component: pages.FlightDetailPage,
            },
        ],
    });
    await router.push({
        name: id ? "flight-detail" : "home",
        params: id ? { id } : {},
        query: { period, from: "HEL", to: "OSL" },
    });
    await router.isReady();
    let mapped = [];
    const warnings = [];
    const app = createSSRApp({
        render: () =>
            h(pages[name], {
                "onMap-flights": (items) => {
                    mapped = items;
                },
            }),
    });
    app.use(router);
    app.config.globalProperties.$t = t;
    app.config.warnHandler = (warning) => warnings.push(warning);
    const html = await renderToString(app);
    assert.deepEqual(warnings, []);
    assert.doesNotMatch(html, /NaN|Infinity|undefined/);
    return {
        html,
        text: html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "),
        mapped,
    };
}

test("all statistics and passport use the same completed flights and year filter", async (suite) => {
    for (const name of [
        "FlightStatsPage",
        "AircraftStatsPage",
        "DelayStatsPage",
        "PassportPage",
    ]) {
        for (const [period, count] of [
            ["ALL-TIME", 28],
            ["2026", 8],
            ["2025", 9],
            ["2024", 3],
            ["2023", 6],
            ["2017", 2],
            ["2030", 0],
        ]) {
            await suite.test(`${name}: ${period}`, async () => {
                const { mapped, text } = await render(name, period);
                const expected = source.flights.filter(
                    (flight) =>
                        flight.status === "completed" &&
                        !flight.friend &&
                        (period === "ALL-TIME" ||
                            flight.date.startsWith(period)),
                );
                assert.equal(mapped.length, count);
                assert.deepEqual(
                    mapped.map((flight) => flight.id).sort(),
                    expected.map((flight) => flight.id).sort(),
                );
                if (!count)
                    assert.match(text, /No past flights for this period/);
                if (period === "2026") {
                    assert.ok(
                        mapped.some(
                            (flight) => flight.id === "ke-81-2026-10-15",
                        ),
                    );
                    assert.ok(
                        mapped.some(
                            (flight) => flight.id === "ke-86-2026-10-17",
                        ),
                    );
                }
            });
        }
    }
});

test("aircraft types, unique tails and booking charts reflect records, including unknown seats", async () => {
    const { html, text } = await render("AircraftStatsPage");
    assert.match(html, /Total Aircraft<\/span><strong>27<\/strong>/);
    assert.match(text, /14 total aircraft types/);
    assert.match(text, /Airbus A380-800 3/);
    assert.match(text, /Boeing 777-300ER 2/);
    assert.match(text, /Economy 25 89% Premium Economy 1 4%/);
    assert.match(text, /Window 24 86% Not recorded 2 7%/);
    assert.match(text, /HL8078 2 flights/);
    assert.match(text, /42L|32K/);
    assert.match(html, /conic-gradient/);
    assert.match(text, /manufacture dates are not available/);
});

test("delay rates exclude missing actual times and use actual arrival differences", async () => {
    const completed = source.flights.filter(
        (flight) => flight.status === "completed",
    );
    const observed = completed.filter((flight) => flight.arrival.actualAt);
    const late = observed.filter(
        (flight) =>
            Date.parse(flight.arrival.actualAt) >
            Date.parse(flight.arrival.scheduledAt),
    );
    const rate = Math.round((late.length / observed.length) * 100);
    const { html, text } = await render("DelayStatsPage");
    assert.match(
        text,
        new RegExp(
            `Arrival times recorded for ${observed.length} of 28 flights`,
        ),
    );
    assert.match(
        html,
        new RegExp(`fc-delay-report__percent[^>]*>\\s*${rate}%`),
    );
    assert.doesNotMatch(text, /KE 81|KE 86/);
    const empty = await render("DelayStatsPage", "2030");
    assert.match(empty.html, /fc-delay-report__percent[^>]*>\s*—/);
    assert.match(empty.text, /No recorded times for this period/);
});

test("editing booking data updates the aircraft statistics without changing other flights", async () => {
    const records = flights.value.filter((flight) => flight.year === "2017");
    const original = records.map((flight) => ({ ...flight.booking }));
    try {
        for (const flight of records)
            Object.assign(flight.booking, {
                seat: "99z",
                cabin: "Business",
                position: "Aisle",
            });
        const { text } = await render("AircraftStatsPage", "2017");
        assert.match(text, /99Z \(2 times\)/);
        assert.match(text, /Business 2 100%/);
        assert.match(text, /Aisle 2 100%/);
        assert.equal(getFlight("ke-81-2026-10-15").booking.seat, "");
    } finally {
        records.forEach((flight, index) =>
            Object.assign(flight.booking, original[index]),
        );
    }
});

test("New York flights resolve verified registrations and cached public aircraft metadata", async () => {
    for (const [id, registration, code] of [
        ["ke-81-2026-10-15", "HL7621", "A388"],
        ["ke-86-2026-10-17", "HL8041", "B77W"],
    ]) {
        const flight = getFlight(id);
        assert.equal(flight.aircraft.registration, registration);
        assert.equal(flight.aircraft.lookup.status, "loaded");
        assert.equal(flight.aircraft.lookup.data.registration, registration);
        assert.equal(flight.aircraft.lookup.data.icao_type, code);
        assert.equal(flight.aircraft.lookup.source, cache[registration].source);
        assert.match(
            flight.aircraft.image,
            /\/assets\/Aircraft\/KE\/(A388|B773)\.png/,
        );
        assert.equal(flight.aircraft.imageSource, "");
        assert.equal(flight.arrivalDelayMinutes, null);
        const { text, html } = await render("FlightDetailPage", "2026", id);
        assert.match(text, new RegExp(registration));
        assert.match(text, new RegExp(code));
        assert.match(html, /Flight aircraft history/);
        assert.match(html, /api.adsbdb.com/);
        assert.doesNotMatch(html, /Photo: airport-data\.com/);
    }
    assert.equal(getFlight("ke-86-2026-10-17").arrivalDayOffset, "+1");
    // A current registry entry must not overwrite the historical type in the CSV.
    assert.equal(
        getFlight("oz-542-2023-11-21").aircraft.type,
        "Airbus A350-900",
    );
});
