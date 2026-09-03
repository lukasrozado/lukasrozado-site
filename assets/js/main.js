// Os 4 imports partiam em serie (language -> projects-loader -> menu -> filters),
// pagando 1 RTT por salto sob throttling. A UNICA ordem real e initFilters()
// depois de loadProjects(): initFilters chama updateProjectCount(), que conta
// .project-card, e o HTML estatico so traz .project-fallback. projects-loader
// resolve o idioma por location.pathname / <html lang>, nao por algo que
// language.js escreva - por isso os dois sao independentes.
// Sem modulepreload/preload: hint de rede aqui ja regrediu 91->78 contra o hero.
document.addEventListener("DOMContentLoaded", () => {
  // Handler anexado no mesmo tick da criacao: filters.js so e consumido depois de
  // esperar projects, e uma rejeicao sem handler viraria unhandledrejection.
  const safeImport = (spec) =>
    import(spec).then((m) => ({ ok: true, m }), (e) => ({ ok: false, e }));

  const languageModule = safeImport("./modules/language.js");
  const projectsModule = safeImport("./modules/projects-loader.js");
  const menuModule = safeImport("./modules/menu.js");
  const filtersModule = safeImport("./modules/filters.js");

  const loadComponents = async () => {
    const lang =
      window.location.pathname.includes("index-en") || document.documentElement.lang === "en"
        ? "en"
        : "pt";
    const components = ["header", "hero", "projects-section", "footer"];
    // Cada componente escreve num [data-include] distinto e nenhum le o outro.
    await Promise.all(
      components.map(async (component) => {
        try {
          const element = document.querySelector(`[data-include="./components/${lang}/${component}.html"]`);
          if (!element) {
            console.warn(`Elemento não encontrado para: ${component}`);
            return;
          }
          // O componente já vem inline no HTML (SEO/no-JS). Só busca se vier vazio.
          if (element.children.length > 0) return;
          const response = await fetch(`./components/${lang}/${component}.html`);
          if (!response.ok) throw new Error(`${component} não encontrado`);
          element.innerHTML = await response.text();
        } catch (error) {
          console.error(`Error loading ${component}:`, error);
        }
      })
    );
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

  const run = async (imported, fn, msg) => {
    const r = await imported;
    if (!r.ok) return void console.error(msg, r.e);
    try {
      await fn(r.m);
    } catch (error) {
      console.error(msg, error);
    }
  };

  const componentsReady = loadComponents();
  // language.js pode redirecionar; quanto mais cedo, menos trabalho jogado fora.
  const languageReady = run(languageModule, (m) => m.initLanguageSystem(),
    "Language system unavailable; serving static content:");
  // loadProjects() bails silently if .projects-grid isn't in the DOM yet
  // (querySelector null-check, no throw). Today loadComponents() is a no-op
  // per component since every [data-include] ships inline children already -
  // but that's a fact about current content, not a guarantee, so wait for it
  // for real instead of relying on it staying a no-op forever. Measured cost:
  // ~10ms median (4x CPU throttle), 0 network requests in the common case.
  const projectsReady = componentsReady.then(() =>
    run(projectsModule, (m) => m.loadProjects(), "Error loading projects:"));
  // initMenu() acessa #menu-toggle sem checar null: precisa do header no DOM.
  const menuReady = componentsReady.then(() =>
    run(menuModule, (m) => m.initMenu(), "Error initializing modules:"));
  // projectsReady nunca rejeita, entao filters inicializa mesmo se o JSON falhar,
  // como antes. Separar de menu tambem conserta o acoplamento em que initMenu()
  // lancando excecao impedia initFilters() de rodar (dividiam um unico try).
  const filtersReady = Promise.all([componentsReady, projectsReady]).then(() =>
    run(filtersModule, (m) => m.initFilters(), "Error initializing modules:"));

  // Cada etapa engole o proprio erro, entao este catch fica tao inalcancavel
  // quanto o try/catch externo que substitui - de proposito: o banner nao pode
  // passar a aparecer onde hoje nao aparece.
  Promise.all([languageReady, componentsReady, projectsReady, menuReady, filtersReady])
    .catch((error) => {
      console.error("Critical error:", error);
      showNonDestructiveError();
    });
});
