const flagImages = Object.fromEntries(
    Object.entries(
        import.meta.glob("../assets/Flags/*.svg", {
            eager: true,
            query: "?url&no-inline",
            import: "default",
        }),
    ).map(([path, image]) => [
        path
            .split("/")
            .at(-1)
            .replace(/\.svg$/, "")
            .toLowerCase(),
        image,
    ]),
);
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

// 국가 코드·영문 국가명·기존 국기 이모지를 같은 로컬 에셋에 연결합니다.
export function getCountryFlag(value) {
    let country = String(value || "").trim();
    const letters = [...country];
    if (
        letters.length === 2 &&
        letters.every(
            (letter) =>
                letter.codePointAt(0) >= 127462 &&
                letter.codePointAt(0) <= 127487,
        )
    ) {
        country = letters
            .map((letter) =>
                String.fromCharCode(letter.codePointAt(0) - 127397),
            )
            .join("");
    }
    if (/^[a-z]{2}$/i.test(country))
        country = countryNames.of(country.toUpperCase());
    return flagImages[country.toLowerCase()] || "";
}
