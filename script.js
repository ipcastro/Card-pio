// Adiciona um evento de clique ao elemento com ID 'menu-toggle'
document.getElementById('menu-toggle').addEventListener('click', function() {  
    // Seleciona o elemento <nav> (menu de navegação)
    const menu = document.querySelector('nav');  
    
    // Alterna a classe 'active' no menu, ativando/desativando o menu móvel
    menu.classList.toggle('active');  
});

document.addEventListener("DOMContentLoaded", function () {
    // Lista de itens do cardápio, organizada por categoria
    const cardapio = [
        { categoria: "salgado", nome: "Big Mac", descricao: "Dois hambúrgueres (100% carne bovina), alface americana, queijo processado sabor cheddar, molho especial, cebola, picles e pão com gergelim.", preco: "R$21,90", imagem: "Big mac.png" },
        { categoria: "salgado", nome: "Quarteirão com Queijo", descricao: "Um hambúrguer (100% carne bovina), queijo processado sabor cheddar, picles, cebola, ketchup, mostarda e pão com gergelim.", preco: "R$21,90", imagem: "quarteirao.png" },
        { categoria: "salgado", nome: "McChicken Duplo", descricao: "Composto por dois empanados com frango, maionese, alface americana e pão com gergelim.", preco: "R$21,20", imagem: "frango.png" },
        { categoria: "doce", nome: "Casquinha", descricao: "Opções: Baunilha, Chocolate e Mista", preco: "R$8,00", imagem: "casquinha.png" },
        { categoria: "doce", nome: "Torta de Maçã", descricao: "Massa quentinha e crocante envolvendo deliciosos recheios de banana ou maçã com gostinho de doce caseiro.", preco: "R$10,00", imagem: "torta.png" },
        { categoria: "liquido", nome: "Refrigerante", descricao: "Opções: Coca-Cola, Coca-Cola Zero, Sprite sem Açúcar, Fanta Guaraná e Fanta Laranja.", preco: "R$12,00", imagem: "refri.png" },
        { categoria: "liquido", nome: "Suco", descricao: "Deliciosos sabores à sua escolha. Néctar de fruta nos sabores uva ou laranja.", preco: "R$8,00", imagem: "suco.png" }
    ];

    // Seleciona o elemento do HTML onde o cardápio será injetado
    const cardapioContainer = document.getElementById("cardapio");
    
    // Objeto para armazenar categorias e seus respectivos produtos
    let categorias = {};
    
    // Percorre os itens do cardápio e os organiza por categoria
    cardapio.forEach(item => {
        if (!categorias[item.categoria]) {
            categorias[item.categoria] = `<section id="${item.categoria}"><h2>${item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1)}</h2>`;
        }
        categorias[item.categoria] += `
            <div class="produto">
                <img src="${item.imagem}" alt="${item.nome}">
                <h1>${item.nome}</h1>
                <p>${item.descricao}</p>
                <h3>Preço: ${item.preco}</h3>
            </div>
        `;
    });

    // Insere as categorias e os produtos no HTML
    Object.keys(categorias).forEach(categoria => {
        categorias[categoria] += "</section>";
        cardapioContainer.innerHTML += categorias[categoria];
    });
});
