document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { initLanguageSystem } = await import("./modules/language.js");
    initLanguageSystem();
  } catch (error) {
    console.error("Language system unavailable; serving static content:", error);
  }

  const loadFooter = async () => {
    const lang =
      window.location.pathname.includes("index-en") ||
      window.location.pathname.includes("contact-en") ||
      document.documentElement.lang === "en"
        ? "en"
        : "pt";
    try {
      const element = document.querySelector(`[data-include="./components/${lang}/footer.html"]`);
      if (!element) return;
      const response = await fetch(`./components/${lang}/footer.html`);
      if (!response.ok) throw new Error("footer não encontrado");
      element.innerHTML = await response.text();
    } catch (error) {
      console.error("Error loading footer:", error);
    }
  };

  const initMenuModule = async () => {
    try {
      const { initMenu } = await import("./modules/menu.js");
      initMenu();
    } catch (error) {
      console.error("Error initializing menu:", error);
    }
  };

  try {
    await loadFooter();
    await initMenuModule();
  } catch (error) {
    console.error("Critical error:", error);
    showNonDestructiveError();
  }

  function showNonDestructiveError() {
    if (document.getElementById("critical-error-banner")) return;
    const banner = document.createElement("div");
    banner.id = "critical-error-banner";
    banner.setAttribute("role", "alert");
    banner.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:10000;padding:12px 20px;text-align:center;background:#ff4500;color:#fff;font-weight:600;";
    banner.textContent = document.documentElement.lang === "en"
      ? "Some interactive features failed to load. Please reload the page."
      : "Alguns recursos interativos não carregaram. Recarregue a página.";
    document.body.prepend(banner);
  }
});
