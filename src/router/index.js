import { createRouter, createWebHashHistory } from "vue-router";

const HomePage = () => import("../pages/HomePage.vue");

const defaultFrom = "SFO";
const defaultTo = "ICN";
const defaultTitle = "Flighty UI Clone | Vue 3 프론트엔드 포트폴리오";
const defaultDescription =
    "Vue 3, Vue Router, SCSS, MapLibre로 공항 검색, 항로 지도, 재사용 UI를 구현한 비공식 Flighty 클론 프론트엔드 포트폴리오입니다.";

const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior(to, _from, savedPosition) {
        if (to.hash) return { el: to.hash };
        return savedPosition || { top: 0 };
    },
    routes: [
        {
            path: "/",
            component: () => import("../layout/MapLayout.vue"),
            meta: { layout: "map" },
            children: [
                { path: "", redirect: { name: "home" } },
                {
                    path: "home",
                    name: "home",
                    component: HomePage,
                    meta: {
                        title: "내 항공편 | Flighty UI Clone",
                        description:
                            "선택한 공항의 비행 경로와 항공편 목록을 MapLibre 지도에서 확인할 수 있습니다.",
                        panelTitle: "항공편 경로",
                        section: "flights",
                    },
                },
                { path: "map", redirect: { name: "home" } },
                {
                    path: "flights/friends",
                    name: "friend-flights",
                    component: HomePage,
                    meta: {
                        title: "Friends’ Flights | Flighty",
                        panelTitle: "Friends’ Flights",
                        section: "flights",
                        backName: "home",
                    },
                },
                {
                    path: "passport",
                    name: "passport",
                    component: () => import("../pages/PassportPage.vue"),
                    meta: {
                        title: "My Flighty Passport | Flighty",
                        panelTitle: "My Passport",
                        section: "passport",
                    },
                },
                {
                    path: "stats/flights",
                    name: "flight-stats",
                    component: () => import("../pages/FlightStatsPage.vue"),
                    meta: {
                        title: "All Flight Stats | Flighty",
                        panelTitle: "Flight Stats",
                        section: "passport",
                        backName: "passport",
                    },
                },
                {
                    path: "stats/delays",
                    name: "delay-stats",
                    component: () => import("../pages/DelayStatsPage.vue"),
                    meta: {
                        title: "Delay Stats | Flighty",
                        panelTitle: "Delay Stats",
                        section: "passport",
                        backName: "passport",
                    },
                },
                {
                    path: "stats/aircraft",
                    name: "aircraft-stats",
                    component: () => import("../pages/AircraftStatsPage.vue"),
                    meta: {
                        title: "Aircraft Stats | Flighty",
                        panelTitle: "Aircraft Stats",
                        section: "passport",
                        backName: "passport",
                    },
                },
                {
                    path: "settings",
                    name: "settings",
                    component: () => import("../pages/SettingsPage.vue"),
                    meta: {
                        title: "Settings | Flighty",
                        panelTitle: "Settings",
                        section: "settings",
                    },
                },
                {
                    path: "settings/my-flight-alerts",
                    name: "my-flight-alerts",
                    component: () => import("../pages/AlertsPage.vue"),
                    meta: {
                        title: "My Flight Alerts | Flighty",
                        panelTitle: "My Flight Alerts",
                        section: "settings",
                        alertMode: "mine",
                        backName: "settings",
                    },
                },
                {
                    path: "settings/friends-flight-alerts",
                    name: "friends-flight-alerts",
                    component: () => import("../pages/AlertsPage.vue"),
                    meta: {
                        title: "Friends’ Flight Alerts | Flighty",
                        panelTitle: "Friends’ Flight Alerts",
                        section: "settings",
                        alertMode: "friends",
                        backName: "settings",
                    },
                },
                {
                    path: "settings/calendar-sync",
                    name: "calendar-sync",
                    component: () => import("../pages/CalendarSyncPage.vue"),
                    meta: {
                        title: "Calendar Sync | Flighty",
                        panelTitle: "Calendar Sync",
                        section: "settings",
                        backName: "settings",
                    },
                },
                {
                    path: "settings/language",
                    name: "language",
                    component: () => import("../pages/LanguagePage.vue"),
                    meta: {
                        title: "Language | Flighty",
                        panelTitle: "Language",
                        section: "settings",
                        backName: "settings",
                    },
                },
                {
                    path: "settings/units",
                    name: "units",
                    component: () => import("../pages/UnitsPage.vue"),
                    meta: {
                        title: "Units | Flighty",
                        panelTitle: "Units",
                        section: "settings",
                        backName: "settings",
                    },
                },
                {
                    path: "friends",
                    name: "friends",
                    component: () => import("../pages/FriendsPage.vue"),
                    meta: {
                        title: "Flighty Friends | Flighty",
                        panelTitle: "Flighty Friends",
                        section: "friends",
                    },
                },
                {
                    path: "friends/:id",
                    name: "friend-detail",
                    component: () => import("../pages/AlertsPage.vue"),
                    meta: {
                        title: "Friend Alerts | Flighty",
                        panelTitle: "Friend Settings",
                        section: "friends",
                        alertMode: "friend",
                        backName: "friends",
                    },
                },
                {
                    path: "add-flight",
                    name: "add-flight",
                    component: () => import("../pages/AddFlightPage.vue"),
                    meta: {
                        title: "Add Flight | Flighty",
                        panelTitle: "Add Flight",
                        section: "flights",
                        backName: "home",
                    },
                },
                {
                    path: "add-flight/number",
                    name: "add-flight-number",
                    component: () => import("../pages/AddFlightPage.vue"),
                    meta: {
                        title: "Find by Flight Number | Flighty",
                        panelTitle: "Add Flight",
                        section: "flights",
                        searchMode: "number",
                        backName: "add-flight",
                    },
                },
                {
                    path: "add-flight/route",
                    name: "add-flight-route",
                    component: () => import("../pages/AddFlightPage.vue"),
                    meta: {
                        title: "Find by Route | Flighty",
                        panelTitle: "Find by Route",
                        section: "flights",
                        searchMode: "route",
                        backName: "add-flight",
                    },
                },
                {
                    path: "add-flight/calendar",
                    name: "add-flight-calendar",
                    component: () => import("../pages/AddFlightPage.vue"),
                    meta: {
                        title: "Pick Flight Date | Flighty",
                        panelTitle: "Add Flight",
                        section: "flights",
                        searchMode: "calendar",
                        backName: "add-flight-number",
                    },
                },
                {
                    path: "add-flight/results",
                    name: "flight-results",
                    component: HomePage,
                    meta: {
                        title: "Flight Search Results | Flighty",
                        panelTitle: "Flight Results",
                        section: "flights",
                        backName: "add-flight-number",
                    },
                },
                {
                    path: "flights/:id",
                    name: "flight-detail",
                    component: () => import("../pages/FlightDetailPage.vue"),
                    meta: {
                        title: "Flight Details | Flighty",
                        panelTitle: "Flight Details",
                        section: "flights",
                        backName: "home",
                    },
                    children: [
                        {
                            path: "edit",
                            name: "flight-booking",
                            component: () =>
                                import("../pages/FlightBookingPage.vue"),
                            meta: {
                                title: "Edit Booking | Flighty",
                                backName: "flight-detail",
                            },
                        },
                    ],
                },
                {
                    path: "connections/:id",
                    name: "connection",
                    component: () => import("../pages/ConnectionPage.vue"),
                    meta: {
                        title: "Relaxed Connection | Flighty",
                        panelTitle: "Connection",
                        section: "flights",
                        backName: "flight-detail",
                    },
                },
                {
                    path: "connections/:id/details",
                    name: "connection-details",
                    component: () => import("../pages/ConnectionPage.vue"),
                    meta: {
                        title: "Minimum Connection Time | Flighty",
                        panelTitle: "Connection",
                        section: "flights",
                        backName: "connection",
                    },
                },
                {
                    path: "component",
                    name: "component",
                    component: () => import("../pages/ComponentPage.vue"),
                    meta: {
                        title: "Vue 3 UI 컴포넌트 | Flighty UI Clone",
                        description:
                            "Flighty UI 클론을 위해 제작한 Vue 3 기반 항공편 인터페이스 컴포넌트를 소개합니다.",
                        panelTitle: "UI 컴포넌트",
                        widePanel: true,
                    },
                },
            ],
        },
        {
            path: "/intro",
            name: "intro",
            component: () => import("../pages/IntroPage.vue"),
            meta: {
                title: defaultTitle,
                description:
                    "UI 분석과 웹 퍼블리싱부터 Vue 3 공항 검색, 항로 지도 구현까지 소개하는 프론트엔드 포트폴리오입니다.",
            },
        },
    ],
});

router.afterEach((to) => {
    let title = to.meta.title || defaultTitle;
    let description = to.meta.description || defaultDescription;

    if (to.name === "home") {
        const from =
            typeof to.query.from === "string"
                ? to.query.from.trim().toUpperCase().slice(0, 3)
                : defaultFrom;
        const destination =
            typeof to.query.to === "string"
                ? to.query.to.trim().toUpperCase().slice(0, 3)
                : defaultTo;

        if (/^[A-Z]{3}$/.test(from) && /^[A-Z]{3}$/.test(destination)) {
            title = `${from} → ${destination} 비행 경로 | Flighty UI Clone`;
            description = `${from}에서 ${destination}까지의 항로와 샘플 항공편을 MapLibre 지도에서 확인할 수 있습니다.`;
        }
    }

    document.title = title;
    document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", description);
    document
        .querySelector('meta[property="og:title"]')
        ?.setAttribute("content", title);
    document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute("content", description);
    document
        .querySelector('meta[name="twitter:title"]')
        ?.setAttribute("content", title);
    document
        .querySelector('meta[name="twitter:description"]')
        ?.setAttribute("content", description);
});

export default router;
