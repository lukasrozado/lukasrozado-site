export async function loadProjects() {
    try {
        const grid = document.querySelector(".projects-grid");
        if (!grid) return;

        const lang = window.location.pathname.includes("index-en.html") ? "en" : "pt";
        const response = await fetch(`./data/projects/${lang}.json`);
        const data = await response.json();
        
        grid.innerHTML = "";

        data.projects.forEach(project => {
            // Se a imagem não estiver definida no JSON, usa um placeholder ou string vazia
            const diagramImg = project.diagramImage || "";

            const cardHTML = `
                <article class="project-card" 
                         data-technologies="${project.technologies.join(" ")}" 
                         data-difficulty="${project.difficulty}">
                    <div class="card-content-wrapper">
                        <div class="card-header">
                            <span class="project-tag">${project.category}</span>
                            <div class="difficulty">
                                <span class="difficulty-dot ${project.difficulty}"></span>
                                <span class="difficulty-text">${project.difficulty}</span>
                            </div>
                        </div>
                        
                        <div class="card-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                        </div>
        
                        <div class="card-footer">
                            <div class="tech-stack">
                                ${project.techIcons ? project.techIcons.map(icon => `
                                    <img src="assets/icons/${icon}.svg" alt="${icon}" class="tech-icon">
                                `).join("") : ""}
                            </div>
                            <span class="project-duration">${project.duration}</span>
                        </div>

                        <button class="btn-view-arch" data-img="${diagramImg}">
                            Architecture
                        </button>
                    </div>
                </article>
            `;
            grid.insertAdjacentHTML("beforeend", cardHTML);
        });

        // Após injetar todos os cards, ativamos a lógica do Modal
        initArchitectureModal();

    } catch (error) {
        console.error("Error loading projects:", error);
        const countElement = document.getElementById("project-count");
        if(countElement) {
            countElement.textContent = window.location.pathname.includes("index-en.html") ? "Error loading projects" : "Erro ao carregar projetos";
        }
    }
}

// Lógica de Inicialização do Modal
function initArchitectureModal() {
    // Cria a div do modal apenas se ela não existir no DOM
    if (!document.getElementById('arch-modal')) {
        const modalHTML = `
            <div id="arch-modal" class="architecture-modal">
                <div class="architecture-modal-content">
                    <button id="close-arch-modal" class="close-modal-btn" aria-label="Fechar modal">&times;</button>
                    <img id="arch-modal-img" src="" alt="Diagrama de Arquitetura do Sistema">
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('arch-modal');
    const modalImg = document.getElementById('arch-modal-img');
    const closeBtn = document.getElementById('close-arch-modal');

    // Adiciona o evento de clique nos botões recém-criados
    document.querySelectorAll('.btn-view-arch').forEach(button => {
        button.addEventListener('click', (e) => {
            const imgSrc = e.currentTarget.getAttribute('data-img');
            
            // Verifica se a imagem existe e é válida
            if(imgSrc && imgSrc !== "#" && imgSrc !== "undefined" && imgSrc !== "") {
                modalImg.src = imgSrc;
                modal.classList.add('active');
            } else {
                alert("O diagrama desta arquitetura está sendo gerado."); 
            }
        });
    });

    // Lógica de fechamento (X, clique fora ou botão ESC)
    const closeModal = () => modal.classList.remove('active');
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); 
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}