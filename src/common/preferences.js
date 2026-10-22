import { computed, reactive, watch } from "vue";
import messages from "../locales/messages.json";

const storageKey = "flighty-preferences";
const defaults = {
    language: "device",
    distance: "km",
    speed: "km/h",
    altitude: "m",
};
const choices = {
    language: ["device", "ko", "en", "ja"],
    distance: ["km", "mi", "nm"],
    speed: ["mph", "km/h", "kt"],
    altitude: ["ft", "km", "m", "FL"],
};
let saved = {};
try {
    if (typeof localStorage !== "undefined")
        saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
} catch {
    /* 저장소를 사용할 수 없으면 현재 화면에서 설정을 유지합니다. */
}
export const preferences = reactive(
    Object.fromEntries(
        Object.entries(defaults).map(([key, value]) => [
            key,
            choices[key].includes(saved?.[key]) ? saved[key] : value,
        ]),
    ),
);
const deviceLanguage =
    typeof navigator === "undefined" ? "en" : navigator.language.split("-")[0];
export const language = computed(() =>
    preferences.language === "device"
        ? ["ko", "en", "ja"].includes(deviceLanguage)
            ? deviceLanguage
            : "en"
        : preferences.language,
);
export const locale = computed(
    () => ({ ko: "ko-KR", en: "en-US", ja: "ja-JP" })[language.value],
);

watch(
    preferences,
    (value) => {
        try {
            if (typeof localStorage !== "undefined")
                localStorage.setItem(storageKey, JSON.stringify(value));
        } catch {
            /* 브라우저 저장소 차단 시에도 설정 선택은 동작합니다. */
        }
    },
    { deep: true },
);

export function formatNumber(value, options = {}) {
    return Number.isFinite(value)
        ? value.toLocaleString(locale.value, options)
        : "—";
}
export function formatDistance(km, options = {}) {
    const unit = options.unit || preferences.distance;
    const value = km / { km: 1, mi: 1.609344, nm: 1.852 }[unit];
    const number = formatNumber(
        value,
        options.compact
            ? { notation: "compact", maximumFractionDigits: 1 }
            : { maximumFractionDigits: options.decimals ?? 0 },
    );
    return options.withUnit === false ? number : `${number} ${unit}`;
}
export function formatSpeed(kmh) {
    const unit = preferences.speed;
    return `${formatNumber(kmh / { "km/h": 1, mph: 1.609344, kt: 1.852 }[unit], { maximumFractionDigits: 0 })} ${unit}`;
}
export function formatAltitude(meters) {
    const unit = preferences.altitude;
    const value = meters / { m: 1, ft: 0.3048, km: 1000, FL: 30.48 }[unit];
    const number = formatNumber(value, {
        maximumFractionDigits: unit === "km" ? 2 : 0,
    });
    return unit === "FL" ? `FL ${number}` : `${number} ${unit}`;
}
export function formatDuration(minutes) {
    if (!Number.isFinite(minutes)) return "—";
    const rounded = Math.round(minutes);
    const hours = Math.floor(rounded / 60);
    const rest = rounded % 60;
    const units = { en: ["h", "m"], ko: ["시간", "분"], ja: ["時間", "分"] }[
        language.value
    ];
    return [
        hours ? `${hours}${units[0]}` : "",
        rest || !hours ? `${rest}${units[1]}` : "",
    ]
        .filter(Boolean)
        .join(" ");
}
export function countryName(code, fallback = code) {
    try {
        return (
            new Intl.DisplayNames([locale.value], { type: "region" }).of(
                code,
            ) || fallback
        );
    } catch {
        return fallback;
    }
}

// 영어 원문을 키로 사용합니다. 선택·정렬에 쓰는 원본 값은 바꾸지 않고 표시 시점에 번역합니다.
export function t(value, params = {}) {
    if (typeof value !== "string") return value;
    let result = messages[value]?.[language.value] || value;
    if (result === value && !messages[value]) {
        const duration = value.match(
            /^(?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m)?$/,
        );
        const distance = value.match(/^(≈\s*)?([\d,.]+)\s+(km|mi|nm)$/);
        const count = value.match(/^(\d+)\s+(flights?|FLIGHTS?)$/);
        if (duration && duration.slice(1).some(Boolean))
            result = formatDuration(
                Number(duration[1] || 0) * 1440 +
                    Number(duration[2] || 0) * 60 +
                    Number(duration[3] || 0),
            );
        else if (distance)
            result = `${distance[1] || ""}${formatDistance(Number(distance[2].replaceAll(",", "")) * { km: 1, mi: 1.609344, nm: 1.852 }[distance[3]])}`;
        else if (count)
            return t(
                Number(count[1]) === 1 ? "{count} flight" : "{count} flights",
                { count: count[1] },
            );
    }
    return result.replace(/\{(\w+)\}/g, (match, key) => params[key] ?? match);
}
