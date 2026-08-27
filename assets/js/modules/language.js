const INDEX_PAGES = ["index", "index-en", ""];

export function initLanguageSystem() {
  document.body.addEventListener("click", (e) => {
    const button = e.target.closest("[data-lang]");
    if (!button) return;
    e.preventDefault();
    const newLang = button.dataset.lang;
    localStorage.setItem("preferredLang", newLang);
    window.location.href = newLang === "pt" ? "./" : "./index-en";
  });

  const rawPage = window.location.pathname.split("/").pop();
  const currentPage = rawPage === "" ? "index" : rawPage;
  const isIndexPage = INDEX_PAGES.includes(rawPage);
  const savedLang = localStorage.getItem("preferredLang");
  const browserLang = navigator.language.startsWith("pt") ? "pt" : "en";

  if (!savedLang && isIndexPage) {
    const shouldRedirect =
      (browserLang === "pt" && currentPage !== "index") ||
      (browserLang === "en" && currentPage !== "index-en");
    if (shouldRedirect) {
      window.location.href = browserLang === "pt" ? "./" : "./index-en";
      return;
    }
  }

  if (savedLang && isIndexPage) {
    const shouldCorrect =
      (savedLang === "pt" && currentPage === "index-en") ||
      (savedLang === "en" && currentPage === "index");
    if (shouldCorrect) {
      window.location.href = savedLang === "pt" ? "./" : "./index-en";
    }
  }
}
