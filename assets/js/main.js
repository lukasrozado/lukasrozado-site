document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { initLanguageSystem } = await import("./modules/language.js");
    initLanguageSystem();
  } catch (error) {
    console.error("Language system unavailable; serving static content:", error);
  }

  const loadComponents = async () => {
    const lang =
      window.location.pathname.includes("index-en") || document.documentElement.lang === "en"
        ? "en"
        : "pt";
    const components = ["header", "hero", "projects-section", "footer"];
    for (const component of components) {
      try {
        const element = document.querySelector(`[data-include="./components/${lang}/${component}.html"]`);
        if (!element) {
          console.warn(`Elemento não encontrado para: ${component}`);
          continue;
        }
        // O componente já vem inline no HTML (SEO/no-JS). Buscar de novo só repetiria
        // conteúdo idêntico e custa 2 requisições por componente, porque o Cloudflare
        // Pages redireciona .html para a URL sem extensão. Só busca se vier vazio.
        if (element.children.length > 0) continue;
        const response = await fetch(`./components/${lang}/${component}.html`);
        if (!response.ok) throw new Error(`${component} não encontrado`);
        const html = await response.text();
        element.innerHTML = html;
      } catch (error) {
        console.error(`Error loading ${component}:`, error);
      }
    }
  };

  const loadDynamicContent = async () => {
    try {
      const { loadProjects } = await import("./modules/projects-loader.js");
      await loadProjects();
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const initInteractiveModules = async () => {
    try {
      const { initMenu } = await import("./modules/menu.js");
      const { initFilters } = await import("./modules/filters.js");
      initMenu();
      initFilters();
    } catch (error) {
      console.error("Error initializing modules:", error);
    }
  };

  const showNonDestructiveError = () => {
    if (document.getElementById("critical-error-banner")) return;
    const banner = document.createElement("div");
    banner.id = "critical-error-banner";
    banner.setAttribute("role", "alert");
    banner.style.cssText =
      "position:fixed;top:0;left:0;right:0;z-index:10000;padding:12px 20px;text-align:center;background:#ff4500;color:#fff;font-weight:600;";
    banner.textContent = window.location.pathname.includes("index-en")
      ? "Some interactive features failed to load. Please reload the page."
      : "Alguns recursos interativos não carregaram. Recarregue a página.";
    document.body.prepend(banner);
  };

  try {
    await loadComponents();
    await loadDynamicContent();
    await initInteractiveModules();
  } catch (error) {
    console.error("Critical error:", error);
    showNonDestructiveError();
  }
});
