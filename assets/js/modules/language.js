const INDEX_PAGES = ["index.html", "index-en.html", ""];

export function initLanguageSystem() {
  document.body.addEventListener("click", (e) => {
    const button = e.target.closest("[data-lang]");
    if (!button) return;
    e.preventDefault();
    const newLang = button.dataset.lang;
    localStorage.setItem("preferredLang", newLang);
    window.location.href = newLang === "pt" ? "index.html" : "index-en.html";
  });

  const currentPage = window.location.pathname.split("/").pop();
  const isIndexPage = INDEX_PAGES.includes(currentPage);
  const savedLang = localStorage.getItem("preferredLang");
  const browserLang = navigator.language.startsWith("pt") ? "pt" : "en";

  if (!savedLang && isIndexPage) {
    const shouldRedirect =
      (browserLang === "pt" && currentPage !== "index.html") ||
      (browserLang === "en" && currentPage !== "index-en.html");
    if (shouldRedirect) {
      window.location.href = browserLang === "pt" ? "index.html" : "index-en.html";
      return;
    }
  }

  if (savedLang && isIndexPage) {
    const shouldCorrect =
      (savedLang === "pt" && currentPage === "index-en.html") ||
      (savedLang === "en" && currentPage === "index.html");
    if (shouldCorrect) {
      window.location.href = savedLang === "pt" ? "index.html" : "index-en.html";
    }
  }
}
