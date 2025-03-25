// Adiciona um evento de clique ao elemento com ID 'menu-toggle'
document.getElementById('menu-toggle').addEventListener('click', function() {  
    // Seleciona o elemento <nav> (menu de navegação)
    const menu = document.querySelector('nav');  
    
    // Alterna a classe 'active' no menu, ativando/desativando o menu móvel
    menu.classList.toggle('active');  
});
