/* =========================================================
   MENU / NAVEGAÇÃO
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");
    const btnCursos = document.getElementById("btn-cursos");
    const menuCursos = document.getElementById("menu-cursos");
    const seta = document.querySelector(".seta");

    toggle?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        nav.classList.toggle("active");
    });

    btnCursos?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        menuCursos.classList.toggle("active");
        seta?.classList.toggle("ativa");
    });

    document.addEventListener("click", (e) => {
        if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove("active");
            menuCursos?.classList.remove("active");
            seta?.classList.remove("ativa");
        }
    });
});

/* =========================================================
   HEADER COM SOMBRA AO ROLAR
   ========================================================= */
window.addEventListener("scroll", () => {
    document.querySelector(".header")?.classList.toggle("scrolled", window.scrollY > 40);
});

/* =========================================================
   HERO — palavra alternante
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const el = document.querySelector(".hero-word");
    if (!el) return;

    let palavras;
    try { palavras = JSON.parse(el.dataset.words); } catch { return; }
    if (!palavras || palavras.length < 2) return;

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) return;

    let i = 0;
    setInterval(() => {
        el.classList.add("swap");
        setTimeout(() => {
            i = (i + 1) % palavras.length;
            el.textContent = palavras[i];
            el.classList.remove("swap");
        }, 250);
    }, 2600);
});

/* =========================================================
   HERO — palavras alternantes sincronizadas
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const elHero = document.querySelector(".hero-word");
    const elWord = document.querySelector(".word");

    if (!elHero || !elWord) return;

    let palavrasHero, palavrasWord;

    try {
        palavrasHero = JSON.parse(elHero.dataset.words); // ex: ["Inglês", "Espanhol"]
        palavrasWord = JSON.parse(elWord.dataset.words); // ex: ["Speak", "Hablar"]
    } catch {
        return;
    }

    if (!palavrasHero || !palavrasWord || palavrasHero.length !== palavrasWord.length) return;

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) return;

    let i = 0;
    setInterval(() => {
        // Adiciona a animação de transição em ambos
        elHero.classList.add("swap");
        elWord.classList.add("swap");

        setTimeout(() => {
            i = (i + 1) % palavrasHero.length;

            // Atualiza o texto de ambos os elementos em sincronia
            elHero.textContent = palavrasHero[i];
            elWord.textContent = palavrasWord[i];

            // Remove a classe para finalizar o efeito visual
            elHero.classList.remove("swap");
            elWord.classList.remove("swap");
        }, 250);
    }, 2600);
});

/* =========================================================
   HERO — cartão de conversa (EN / ES)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".lang-toggle button");
    const bubbleWrap = document.getElementById("chatBubbles");
    if (!botoes.length || !bubbleWrap) return;

    const conversas = {
        en: [
            { autor: "them", texto: "How was your week?" },
            { autor: "you", texto: "It was great! I finally watched a movie without subtitles 🎬" },
            { autor: "them", texto: "That's huge. Tell me about it — in English." }
        ],
        es: [
            { autor: "them", texto: "¿Cómo estuvo tu semana?" },
            { autor: "you", texto: "¡Genial! Por fin vi una película sin subtítulos 🎬" },
            { autor: "them", texto: "Eso es enorme. Cuéntame, en español." }
        ]
    };

    function renderizarConversa(idioma) {
        bubbleWrap.innerHTML = "";
        conversas[idioma].forEach(msg => {
            const bolha = document.createElement("div");
            bolha.className = `bubble ${msg.autor}`;
            bolha.textContent = msg.texto;
            bubbleWrap.appendChild(bolha);
        });
    }

    botoes.forEach(btn => {
        btn.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderizarConversa(btn.dataset.lang);
        });
    });

    renderizarConversa("en");
});

/* =========================================================
   CURSOS — switcher (genérico: funciona com qualquer nº de abas)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const tablist = document.querySelector(".cursos-tablist");
    const indicador = document.querySelector(".tab-indicator");
    const abas = document.querySelectorAll(".curso-tab");
    const paineis = document.querySelectorAll(".curso-panel");
    if (!tablist || !indicador || !abas.length) return;

    function moverIndicador(aba) {
        indicador.style.width = `${aba.offsetWidth}px`;
        indicador.style.transform = `translateX(${aba.offsetLeft - 6}px)`;
    }

    function ativarAba(aba, { foco = false } = {}) {
        abas.forEach(a => {
            const ativa = a === aba;
            a.classList.toggle("active", ativa);
            a.setAttribute("aria-selected", ativa ? "true" : "false");
            a.tabIndex = ativa ? 0 : -1;
        });

        paineis.forEach(painel => {
            const deveMostrar = painel.id === aba.getAttribute("aria-controls");
            painel.hidden = !deveMostrar;
            painel.classList.toggle("active", deveMostrar);
        });

        moverIndicador(aba);
        if (foco) aba.focus();
    }

    abas.forEach(aba => aba.addEventListener("click", () => ativarAba(aba)));

    tablist.addEventListener("keydown", (e) => {
        const atual = Array.from(abas).indexOf(document.activeElement);
        if (atual === -1) return;

        let proximo = null;
        if (e.key === "ArrowRight") proximo = (atual + 1) % abas.length;
        if (e.key === "ArrowLeft") proximo = (atual - 1 + abas.length) % abas.length;

        if (proximo !== null) {
            e.preventDefault();
            ativarAba(abas[proximo], { foco: true });
        }
    });

    const abaAtiva = document.querySelector(".curso-tab.active") || abas[0];
    moverIndicador(abaAtiva);
    window.addEventListener("resize", () => moverIndicador(document.querySelector(".curso-tab.active")));
});

/* =========================================================
   DEPOIMENTOS (carrossel automático)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const depoimentos = document.querySelectorAll(".carousel .item");
    if (!depoimentos.length) return;

    let index = 0;
    setInterval(() => {
        depoimentos[index].classList.remove("active");
        index = (index + 1) % depoimentos.length;
        depoimentos[index].classList.add("active");
    }, 6000);
});

/* =========================================================
   FAQ (acordeão)
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".faq-item").forEach(item => {
        item.addEventListener("click", () => item.classList.toggle("active"));
    });
});

/* =========================================================
   GALERIA / LIGHTBOX
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const imagens = Array.from(document.querySelectorAll(".masonry img"));
    const lightbox = document.querySelector(".lightbox");
    const lightboxImg = document.querySelector(".lightbox-img");
    const fechar = document.querySelector(".close");
    const btnPrev = document.querySelector(".lightbox-prev");
    const btnNext = document.querySelector(".lightbox-next");
    if (!lightbox || !lightboxImg || !imagens.length) return;

    let indiceAtual = 0;

    function abrirImagem(indice) {
        indiceAtual = (indice + imagens.length) % imagens.length; // wraparound nas pontas
        lightboxImg.src = imagens[indiceAtual].src;
        lightboxImg.alt = imagens[indiceAtual].alt || "Imagem ampliada";
    }

    function abrirLightbox(indice) {
        abrirImagem(indice);
        lightbox.classList.add("active");
    }

    function fecharLightbox() {
        lightbox.classList.remove("active");
    }

    imagens.forEach((img, i) => {
        img.addEventListener("click", () => abrirLightbox(i));
    });

    btnPrev?.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirImagem(indiceAtual - 1);
    });

    btnNext?.addEventListener("click", (e) => {
        e.stopPropagation();
        abrirImagem(indiceAtual + 1);
    });

    fechar?.addEventListener("click", fecharLightbox);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) fecharLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") fecharLightbox();
        if (e.key === "ArrowRight") abrirImagem(indiceAtual + 1);
        if (e.key === "ArrowLeft") abrirImagem(indiceAtual - 1);
    });

    /* =========================================================
       ARRASTAR PARA TROCAR DE IMAGEM (mouse + touch)
       ========================================================= */
    let inicioX = 0;
    let arrastando = false;
    const LIMIAR_ARRASTO = 50; // pixels mínimos para considerar "trocou de imagem"

    function iniciarArrasto(x) {
        inicioX = x;
        arrastando = true;
        lightboxImg.style.transition = "none";
    }

    function moverArrasto(x) {
        if (!arrastando) return;
        const delta = x - inicioX;
        lightboxImg.style.transform = `translateX(${delta}px)`;
    }

    function finalizarArrasto(x) {
        if (!arrastando) return;
        arrastando = false;
        const delta = x - inicioX;

        lightboxImg.style.transition = "transform 0.25s ease";
        lightboxImg.style.transform = "translateX(0)";

        if (Math.abs(delta) > LIMIAR_ARRASTO) {
            if (delta < 0) abrirImagem(indiceAtual + 1); // arrastou pra esquerda -> próxima
            else abrirImagem(indiceAtual - 1);            // arrastou pra direita -> anterior
        }
    }

    // Mouse
    lightboxImg.addEventListener("mousedown", (e) => {
        e.preventDefault();
        iniciarArrasto(e.clientX);
    });

    window.addEventListener("mousemove", (e) => moverArrasto(e.clientX));

    window.addEventListener("mouseup", (e) => finalizarArrasto(e.clientX));

    // Touch
    lightboxImg.addEventListener("touchstart", (e) => {
        iniciarArrasto(e.touches[0].clientX);
    }, { passive: true });

    lightboxImg.addEventListener("touchmove", (e) => {
        moverArrasto(e.touches[0].clientX);
    }, { passive: true });

    lightboxImg.addEventListener("touchend", (e) => {
        finalizarArrasto(e.changedTouches[0].clientX);
    });
});

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const alvos = document.querySelectorAll(".reveal");
    if (!alvos.length) return;

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzMovimento) {
        alvos.forEach(el => el.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    alvos.forEach(el => observer.observe(el));
});

/* =========================================================
   FORMULÁRIO DE CONTATO -> planilha + WhatsApp
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formContato");
    if (!form) return;

    const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbxKERebJEW8EXucy5ULalyhPE1uKv5O_X4Ml9hU5ZbqF4xGazK9zD5rgD_zEUODet4KOA/exec";

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const submitBtn = form.querySelector("button");
        const textoOriginal = submitBtn.innerText;
        submitBtn.innerText = "Enviando...";
        submitBtn.disabled = true;

        const nome = document.getElementById("nome").value;
        const idioma = document.getElementById("idioma").value;
        const mensagem = document.getElementById("mensagem").value;

        const formData = new FormData(form);

        fetch(URL_PLANILHA, { method: "POST", body: formData })
            .then(() => {
                const textoWhats = `Olá! Meu nome é ${nome}. Tenho interesse no curso de ${idioma}. ${mensagem}`;
                const linkWhats = `https://wa.me/555197692906?text=${encodeURIComponent(textoWhats)}`;
                window.location.href = linkWhats;
            })
            .catch(error => {
                alert("Erro ao salvar dados. Tente novamente.");
                console.error(error);
                submitBtn.disabled = false;
                submitBtn.innerText = textoOriginal;
            });
    });
});