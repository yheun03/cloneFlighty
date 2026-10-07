import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

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
                    },
                },
                { path: "map", redirect: { name: "home" } },
                {
                    path: "component",
                    name: "component",
                    component: () =>
                        import("../component/fc/FcComponentGallery.vue"),
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
                : "ICN";
        const destination =
            typeof to.query.to === "string"
                ? to.query.to.trim().toUpperCase().slice(0, 3)
                : "SFO";

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
