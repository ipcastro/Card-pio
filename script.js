// Módulo de Dados (Data Layer)
// Responsável por gerenciar os dados do cardápio e carrinho
// ==========================================
const DataModule = {
    // Dados do cardápio com informações dos produtos
    cardapio: [
        { categoria: "salgado", nome: "Big Mac", descricao: "Dois hambúrgueres (100% carne bovina)...", preco: "R$21,90", calorias: "503 kcal", tipo: "tradicional", imagem: "Big mac.png" },
        { categoria: "salgado", nome: "Quarteirão com Queijo", descricao: "Um hambúrguer (100% carne bovina)...", preco: "R$21,90", calorias: "523 kcal", tipo: "tradicional", imagem: "quarteirao.png" },
        { categoria: "doce", nome: "Casquinha", descricao: "Opções: Baunilha, Chocolate e Mista", preco: "R$8,00", calorias: "170 kcal", tipo: "vegetariano", imagem: "casquinha.png" },
        { categoria: "liquido", nome: "Refrigerante", descricao: "Opções: Coca-Cola, Sprite...", preco: "R$12,00", calorias: "201 kcal", tipo: "vegano", imagem: "refri.png" }
    ],
    carrinho: [],

    // Métodos para acessar e manipular os dados
    getCardapio() {
        return this.cardapio;
    },

    getCarrinho() {
        return this.carrinho;
    },

    adicionarAoCarrinho(produto) {
        this.carrinho.push({...produto, id: Date.now()});
        EventEmitter.emit('carrinhoAtualizado');
    },

    removerDoCarrinho(index) {
        this.carrinho.splice(index, 1);
        EventEmitter.emit('carrinhoAtualizado');
    }
};

// ==========================================
// Módulo de Utilidades (Utility Layer)
// Funções auxiliares para manipulação de dados
// ==========================================
const Utils = {
    // Função para limitar a frequência de execução de uma função
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Função para memorizar resultados de funções
    memoize(fn) {
        const cache = new Map();
        return (...args) => {
            const key = JSON.stringify(args);
            if (cache.has(key)) return cache.get(key);
            const result = fn.apply(this, args);
            cache.set(key, result);
            return result;
        };
    },

    // Funções para manipulação de preços
    precoParaNumero(preco) {
        return Number(preco.replace('R$', '').replace(',', '.'));
    },

    numeroParaPreco(numero) {
        return `R$${numero.toFixed(2).replace('.', ',')}`;
    }
};

// ==========================================
// Módulo de Eventos (Event Layer)
// Sistema de eventos para comunicação entre módulos
// ==========================================
const EventEmitter = {
    events: {},

    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },

    emit(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
};


// Módulo de UI (Presentation Layer)

const UIModule = {
    // Templates HTML para diferentes componentes
    templates: {
        // Template para exibição de produtos
        produto: (produto) => `
            <div class="produto">
                <div class="produto-imagem-container">
                    <img data-src="${produto.imagem}" 
                         alt="${produto.nome}"
                         class="lazy-image"
                         src="placeholder.png">
                    <div class="produto-hover-info">
                        <span class="calorias">${produto.calorias}</span>
                    </div>
                </div>
                <div class="tipo-indicador ${produto.tipo}">
                    <span class="tipo-texto">${produto.tipo}</span>
                </div>
                <h1>${produto.nome}</h1>
                <p>${produto.descricao}</p>
                <h3>Preço: ${produto.preco}</h3>
                <button class="btn-adicionar" data-produto='${JSON.stringify(produto)}'>
                    Adicionar ao Carrinho
                </button>
            </div>
        `,

        // Template para itens do carrinho
        itemCarrinho: (item, index) => `
            <div class="item-carrinho">
                <div class="item-info">
                    <span class="item-nome">${item.nome}</span>
                    <span class="item-preco">${item.preco}</span>
                </div>
                <button class="remover-item" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `,

        // Template para o carrinho flutuante
        carrinho: () => `
            <div id="carrinho-container" class="carrinho-minimizado">
                <button id="toggle-carrinho" class="carrinho-botao">
                    <img src="carrinho.png" alt="Carrinho" class="carrinho-icone">
                    <span class="carrinho-contador">0</span>
                </button>
                <div class="carrinho-popup">
                    <div class="carrinho-header">
                        <h3>Meu Pedido</h3>
                        <button class="fechar-carrinho">&times;</button>
                    </div>
                    <div id="carrinho-lista"></div>
                    <div id="total-carrinho">Total: R$0,00</div>
                </div>
            </div>
        `
    },

    // Função para renderizar o cardápio
    renderizarCardapio: Utils.memoize(() => {
        const cardapioContainer = document.getElementById("cardapio");
        const categorias = {};
        
        DataModule.getCardapio().forEach(item => {
            if (!categorias[item.categoria]) {
                categorias[item.categoria] = `<section id="${item.categoria}">
                    <h2>${item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1)}</h2>`;
            }
            categorias[item.categoria] += UIModule.templates.produto(item);
        });
        
        cardapioContainer.innerHTML = Object.values(categorias)
            .map(cat => cat + "</section>")
            .join("");

        UIModule.initializeLazyLoading();
    }),

    // Função para renderizar o carrinho
    renderizarCarrinho: () => {
        const carrinhoLista = document.getElementById('carrinho-lista');
        const totalElement = document.getElementById('total-carrinho');
        const contadorElement = document.querySelector('.carrinho-contador');
        
        const carrinho = DataModule.getCarrinho();
        const total = carrinho.reduce((acc, item) => 
            acc + Utils.precoParaNumero(item.preco), 0);

        carrinhoLista.innerHTML = carrinho
            .map((item, index) => UIModule.templates.itemCarrinho(item, index))
            .join('');
        
        const totalFormatado = Utils.numeroParaPreco(total);
        totalElement.textContent = `Total: ${totalFormatado}`;
        contadorElement.textContent = carrinho.length;
    },

    // Função para carregamento preguiçoso de imagens
    initializeLazyLoading: () => {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    },

    // Configuração dos event listeners
    setupEventListeners: () => {
        // Adicionar ao carrinho
        document.getElementById('cardapio').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-adicionar')) {
                const produto = JSON.parse(e.target.dataset.produto);
                DataModule.adicionarAoCarrinho(produto);
                document.getElementById('carrinho-container').classList.remove('carrinho-minimizado');
            }
        });

        // Remover do carrinho
        document.getElementById('carrinho-lista').addEventListener('click', (e) => {
            if (e.target.classList.contains('remover-item')) {
                const index = parseInt(e.target.dataset.index);
                DataModule.removerDoCarrinho(index);
            }
        });

        // Otimização do scroll
        window.addEventListener('scroll', Utils.debounce(() => {
            UIModule.initializeLazyLoading();
        }, 100));

        // Toggle do carrinho
        document.getElementById('toggle-carrinho').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('carrinho-container').classList.toggle('carrinho-minimizado');
        });

        // Fechar carrinho
        document.querySelector('.fechar-carrinho')?.addEventListener('click', () => {
            document.getElementById('carrinho-container').classList.add('carrinho-minimizado');
        });
    }
};


// Inicialização da Aplicação
document.addEventListener("DOMContentLoaded", () => {
    // Adiciona o container do carrinho
    document.body.insertAdjacentHTML('beforeend', UIModule.templates.carrinho());
    
    // Configuração inicial
    UIModule.renderizarCardapio();
    UIModule.setupEventListeners();
    
    // Registra listener para atualizações do carrinho
    EventEmitter.on('carrinhoAtualizado', UIModule.renderizarCarrinho);
});
