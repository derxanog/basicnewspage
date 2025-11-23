document.addEventListener("DOMContentLoaded", function() {
    
    // --- Configuração ATUALIZADA ---
    // Em vez da URL completa, usamos o ID e o nome do arquivo
    const GIST_ID = "";
    const GIST_FILENAME = "";

    // Define o tempo de cache (em milissegundos). 5 minutos = 300000
    const CACHE_DURATION_MS = 5 * 60 * 1000; 

    // --- Elementos da Página ---
    const container = document.getElementById("posts-container");
    const pageTitle = document.getElementById("page-title");
    const navLinks = document.querySelectorAll(".nav-link");

    // --- "Banco de Dados" Local ---
    let allPosts = [];
    
    // --- FUNÇÃO HELPER: Pegar ID de vídeo do YouTube ---
    function getYoutubeVideoId(url) {
        if (!url) return null;
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[2].length == 11) ? match[2] : null;
    }

    // -----------------------------------------------------------------
    // FUNÇÃO 1: RENDERIZA OS POSTS NA TELA
    // -----------------------------------------------------------------
    function displayPosts(postsToShow, filter) {
        container.innerHTML = ""; // Limpa a tela

        if (filter === 'materia') {
            pageTitle.textContent = "Últimas Matérias (Imagens)";
        } else if (filter === 'reportagem') {
            pageTitle.textContent = "Últimas Reportagens (Vídeos)";
        } else {
            pageTitle.textContent = "Últimas Edições (Geral)";
        }

        if (postsToShow.length === 0) {
            container.innerHTML = "<p>Nenhuma publicação encontrada nesta categoria.</p>";
            return;
        }

        postsToShow.forEach((post, index) => {
            const card = document.createElement("article");
            card.className = "post-card"; 
            
            const postUrl = post.urlRecurso || post.urlDoPng;

            const isGeralTab = (filter === 'geral');
            if (isGeralTab && index === 0) {
                card.classList.add("post-card-new");
            }
            
            if (post.categoria === 'reportagem') {
                const videoId = getYoutubeVideoId(postUrl);
                card.classList.add("post-card-video");

                if (videoId) {
                    card.innerHTML = `
                        <div class="video-responsive-wrapper">
                            <iframe 
                                src="https://www.youtube-nocookie.com/embed/${videoId}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        <div class="card-content">
                            <h3>${post.titulo}</h3>
                            <p class="data">${post.data} | <span class="categoria reportagem">${post.categoria}</span></p>
                        </div>
                    `;
                } else {
                    card.innerHTML = `
                        <div class="card-content">
                            <h3>${post.titulo}</h3>
                            <p class="data">${post.data} | <span class="categoria reportagem">${post.categoria}</span></p>
                            <p style="color: red;">Erro: Link da reportagem (YouTube) inválido ou não suportado.</p>
                        </div>
                    `;
                }

            } else {
                card.classList.add("post-card-image");
                card.innerHTML = `
                    <a href="${postUrl}" target="_blank" title="Clique para ampliar">
                        <img src="${postUrl}" alt="${post.titulo}" loading="lazy">
                    </a>
                    <div class="card-content">
                        <h3>${post.titulo}</h3>
                        <p class="data">${post.data} | <span class="categoria materia">${post.categoria || 'materia'}</span></p>
                    </div>
                `;
            }
            
            container.appendChild(card);
        });
    }

    // -----------------------------------------------------------------
    // FUNÇÃO 2: FILTRA OS POSTS E ATUALIZA A NAVEGAÇÃO
    // -----------------------------------------------------------------
    function handleFilterChange(filter) {
        let filteredPosts = [];

        if (filter === 'materia') {
            filteredPosts = allPosts.filter(post => post.categoria === 'materia' || !post.categoria); 
        } else if (filter === 'reportagem') {
            filteredPosts = allPosts.filter(post => post.categoria === 'reportagem');
        } else {
            filteredPosts = allPosts;
            filter = 'geral'; 
        }

        navLinks.forEach(link => {
            if (link.getAttribute('data-filter') === filter) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        displayPosts(filteredPosts, filter);
    }
    
    // -----------------------------------------------------------------
    // FUNÇÃO 3: VERIFICA O HASH DA URL E INICIA O FILTRO
    // -----------------------------------------------------------------
    function handleRouting() {
        // Se allPosts estiver vazio, o carregarPosts falhou
        if (allPosts.length === 0) return; 
        
        const hash = window.location.hash.substring(1); 
        handleFilterChange(hash || 'geral');
    }

    // -----------------------------------------------------------------
    // FUNÇÃO PRINCIPAL: CARREGA OS DADOS DO GIST (COM CACHE)
    // --- ATUALIZADA ---
    // -----------------------------------------------------------------
    async function carregarPosts() {
        container.innerHTML = "<p>Carregando...</p>";

        const cacheKey = 'jornalCache';
        const cacheTimeKey = 'jornalCacheTime';

        try {
            // 1. Tenta pegar os dados do cache
            const cachedData = localStorage.getItem(cacheKey);
            const cachedTime = localStorage.getItem(cacheTimeKey);
            
            if (cachedData && cachedTime && (new Date().getTime() - cachedTime < CACHE_DURATION_MS)) {
                // 2. Se o cache existir e for recente, usa ele!
                console.log("Carregando posts do Cache (rápido)");
                allPosts = JSON.parse(cachedData);
            } else {
                // 3. Se o cache for antigo ou não existir, busca no GitHub
                console.log("Carregando posts do Gist (fetch API)");
                
                // Monta a URL da API do Gist
                const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;
                
                const response = await fetch(GIST_API_URL, {
                    // Adicionar headers é uma boa prática para a API do GitHub
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                    }
                }); 
                
                if (!response.ok) {
                    throw new Error(`Erro ao buscar o Gist: ${response.statusText} (${response.status})`); 
                }
                
                const gistData = await response.json();
                
                // 3b. O Gist foi encontrado, agora localize o arquivo dentro dele
                if (!gistData.files || !gistData.files[GIST_FILENAME]) {
                     throw new Error(`Arquivo "${GIST_FILENAME}" não foi encontrado no Gist ${GIST_ID}.`);
                }
                
                // 4. Pega o conteúdo (que é um texto JSON) e converte (parse) para um objeto
                const fileContent = gistData.files[GIST_FILENAME].content;
                allPosts = JSON.parse(fileContent);
                
                // 5. Salva os novos dados no cache
                localStorage.setItem(cacheKey, JSON.stringify(allPosts));
                localStorage.setItem(cacheTimeKey, new Date().getTime().toString());
            }

            // 6. Finalmente, mostra os posts na tela
            handleRouting();

        } catch (error) {
            console.error("Falha ao carregar posts:", error);
            container.innerHTML = `<p style='color: red;'>${error.message}</p>`;
        }
    }

    // -----------------------------------------------------------------
    // INICIALIZAÇÃO
    // -----------------------------------------------------------------
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');
            window.location.hash = (filter === 'geral') ? '' : filter;
        });
    });

    window.addEventListener('hashchange', handleRouting);
    
    carregarPosts();
});