document.addEventListener(
    "DOMContentLoaded",
    () => {
        // Handle search from header on accueil.html
        const headerSearchForm =
            document.querySelector(
                ".header-search"
            );

        if (headerSearchForm) {
            const searchInput =
                headerSearchForm.querySelector(
                    ".header-search-input"
                );

            if (searchInput) {
                searchInput.addEventListener(
                    "keypress",
                    (e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();

                            const query =
                                searchInput
                                .value.trim();

                            if (query) {
                                window.location.href =
                                    `rechercher.html?q=${encodeURIComponent(query)}`;
                            }
                        }
                    }
                );
            }
        }
    }
);

let SEARCH_DATA = {};

/* -----------------------------
   Get query from URL
------------------------------*/
function getQuery() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("q") || ""
    ).toLowerCase().trim();
}

/* -----------------------------
   Load language JSON
------------------------------*/
async function loadSearchData() {

    const lang =
        localStorage.getItem(
            "siteLang"
        ) || "fr-FR";

    const response =
        await fetch(
            `/languages/${lang}.json`
        );

    SEARCH_DATA =
        await response.json();
}

/* -----------------------------
   Detect page
------------------------------*/
function getPageFromKey(key) {

    key = key.toLowerCase();

    if (key.includes("eiffel"))
        return "tour_eiffel.html";

    if (key.includes("louvre"))
        return "musee_louvre.html";

    if (key.includes("versailles"))
        return "chateau_versailles.html";

    if (key.includes("disney"))
        return "disneyland.html";

    if (
        key.includes("nd") ||
        key.includes("notre")
    )
        return "notre-dame.html";

    return "accueil.html";
}

/* -----------------------------
   Search
------------------------------*/
function searchSite(query) {

    const results = [];

    for (
        const [key, value]
        of Object.entries(SEARCH_DATA)
    ) {

        const text =
            String(value)
            .toLowerCase();

        if (
            text.includes(query)
        ) {

            results.push({
                key,
                value,
                page:
                    getPageFromKey(key)
            });
        }
    }

    return results;
}

/* -----------------------------
   Display results
------------------------------*/
function getPageTitle(page) {

    const map = {
        "accueil.html": "Accueil",
        "tour_eiffel.html": "Tour Eiffel",
        "musee_louvre.html": "Musée du Louvre",
        "chateau_versailles.html": "Château de Versailles",
        "disneyland.html": "Disneyland Paris",
        "notre-dame.html": "Notre-Dame de Paris"
    };

    return map[page] || "Page";
}
function displayResults(results, query) {

    const container =
        document.getElementById("searchResults");

    if (!results.length) {

        container.innerHTML = `
            <p>No results for "<strong>${query}</strong>"</p>
        `;

        return;
    }

    container.innerHTML =
        results.map(result => `

            <a class="search-result" href="${result.page}">
                <h3>${result.value}</h3>

                <p>
                    ${getPageTitle(result.page)}
                </p>

            </a>

        `).join("");
}

/* -----------------------------
   Init
------------------------------*/
document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const query =
            getQuery();

        await loadSearchData();

        const results =
            searchSite(query);

        displayResults(
            results,
            query
        );
    }
);