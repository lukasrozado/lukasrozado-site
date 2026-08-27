const currentLang = () =>
  window.location.pathname.includes("index-en.html") || document.documentElement.lang === "en"
    ? "en"
    : "pt";

export async function loadProjects() {
  try {
    const grid = document.querySelector(".projects-grid");
    if (!grid) return;

    const lang = currentLang();
    const response = await fetch(`./data/projects/${lang}.json`);
    const data = await response.json();
    const detailSuffix = lang === "en" ? "-en.html" : ".html";

    grid.innerHTML = "";

    data.projects.forEach((project) => {
      const diagram = project.diagramImage || "";
      const actionHtml = project.externalLink
        ? `<a class="btn-view-arch" href="${project.externalLink}" target="_blank" rel="noopener noreferrer">
                        ${lang === "en" ? "View on Kaggle" : "Ver no Kaggle"} &nearr;
                   </a>`
        : `<button class="btn-view-arch" data-img="${diagram}">
                        ${lang === "en" ? "Architecture" : "Arquitetura"}
                   </button>`;
      const card = `
                <article class="project-card"
                         data-technologies="${project.technologies.join(" ")}">
                    <a class="project-link" href="./projects/${project.slug}${detailSuffix}" aria-label="${project.title}">
                        <div class="card-header">
                            <span class="project-tag">${project.category}</span>
                        </div>

                        <div class="card-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                        </div>

                        ${
                          project.caseStudy
                            ? `<div class="card-case-study">
                            <p><strong>${lang === "en" ? "Problem:" : "Problema:"}</strong> ${project.caseStudy.problem}</p>
                            <p><strong>${lang === "en" ? "Solution:" : "Solução:"}</strong> ${project.caseStudy.solution}</p>
                            <p><strong>${lang === "en" ? "Impact:" : "Impacto:"}</strong> ${project.caseStudy.impact}</p>
                        </div>`
                            : ""
                        }

                        <div class="card-footer">
                            <div class="tech-stack">
                                ${project.techIcons ? project.techIcons.map((icon) => `
                                    <img src="assets/icons/${icon}.svg" alt="${icon}" class="tech-icon">
                                `).join("") : ""}
                            </div>
                        </div>

                        <span class="case-study-hint">${lang === "en" ? "View case study" : "Ver case study"} &rarr;</span>
                    </a>

                    ${actionHtml}
                </article>
            `;
      grid.insertAdjacentHTML("beforeend", card);
    });

    initArchitectureModal();
  } catch (error) {
    console.error("Error loading projects:", error);
    const counter = document.getElementById("project-count");
    if (counter) {
      counter.textContent =
        window.location.pathname.includes("index-en.html")
          ? "Error loading projects"
          : "Erro ao carregar projetos";
    }
  }
}

function initArchitectureModal() {
  if (!document.getElementById("arch-modal")) {
    const modalHtml = `
            <div id="arch-modal" class="architecture-modal">
                <div class="architecture-modal-content">
                    <button id="close-arch-modal" class="close-modal-btn" aria-label="Fechar modal">&times;</button>
                    <img id="arch-modal-img" src="" alt="Diagrama de Arquitetura do Sistema">
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  const modal = document.getElementById("arch-modal");
  const modalImg = document.getElementById("arch-modal-img");
  const closeBtn = document.getElementById("close-arch-modal");

  document.querySelectorAll(".btn-view-arch").forEach((button) => {
    button.addEventListener("click", (event) => {
      const img = event.currentTarget.getAttribute("data-img");
      if (img && img !== "#" && img !== "undefined" && img !== "") {
        modalImg.src = img;
        modal.classList.add("active");
      } else {
        alert(
          document.documentElement.lang === "en"
            ? "This architecture diagram is being generated."
            : "O diagrama desta arquitetura está sendo gerado."
        );
      }
    });
  });

  const closeModal = () => modal.classList.remove("active");
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}
