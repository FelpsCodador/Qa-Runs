let gameStarted = false; // Variável para controlar se o jogo já começou

const startGame = () => {
    document.getElementById('start-screen').style.display = 'none'; // Esconde a tela inicial
    gameStarted = true; // Marca que o jogo começou

    // Mostra o obstáculo e reinicia as animações ao começar o jogo
    pipe.style.display = 'block';
    pipe.style.animation = 'pipe-animation 1.5s infinite linear';
    orangutango.style.animation = '';

    const clouds = document.querySelector('.clouds');
    if (clouds) {
        clouds.classList.remove('clouds-paused');
        clouds.style.animationIterationCount = '1'; // Faz o GIF da nuvem aparecer apenas uma vez
    }
};

const jumpSound = new Audio('./sounds/jump.mp3'); // Caminho para o arquivo de som

let ponto = 0; // Pontuação atual
let highScore = localStorage.getItem('highScore') || 0; // Recupera o recorde do localStorage

// Atualiza o recorde na tela ao carregar a página
document.getElementById('high-score').textContent = `Recorde: ${highScore}`;

const updateScore = () => {
    ponto++; // Incrementa a pontuação
    document.getElementById('score').textContent = `Pontuação: ${ponto}`;
};

// Seleciona o elemento do personagem (orangutango) no DOM
const orangutango = document.querySelector('.orangutango');

// Seleciona o elemento do obstáculo (pipe) no DOM
const pipe = document.querySelector('.pipe');

// Define a animação do obstáculo como "nenhuma" antes do jogo começar
pipe.style.animation = 'none';

// Esconde o obstáculo antes do jogo começar
pipe.style.display = 'none';

// Define a animação do personagem como "nenhuma" antes do jogo começar
orangutango.style.animation = 'none';

// Variável para controlar se o personagem está pulando
let isJumping = false;

// Função que faz o personagem pular
const jump = () => {
    // Verifica se o jogo já começou ou se o personagem já está pulando
    if (!gameStarted || isJumping) return; // Se o jogo não começou ou o personagem já está pulando, a função é interrompida para evitar múltiplos pulos simultâneos.

    isJumping = true; // Marca que o personagem está pulando, impedindo que outro pulo seja iniciado enquanto este não terminar.

    // Adiciona a classe "jump" ao personagem para aplicar a animação de pulo
    orangutango.classList.add('jump');

    // Altera a imagem do personagem para a animação de pulo
    orangutango.src = './imagens do game/ninjasalto-unscreen.gif';

    // Ajusta a largura da imagem do personagem durante o pulo
    orangutango.style.width = '160px';

    // Define um temporizador para reverter as alterações após 600ms (duração do pulo)
    setTimeout(() => {
        // Remove a classe "jump" para encerrar a animação de pulo
        orangutango.classList.remove('jump');

        // Altera a imagem do personagem de volta para a posição inicial
        orangutango.src = './imagens do game/return.gif';

        // Ajusta a largura da imagem do personagem de volta ao tamanho original
        orangutango.style.width = '200px';

        isJumping = false; // Permite que o personagem pule novamente.
        // Isso acontece porque, ao definir `isJumping` como `false`, a próxima vez que a função `jump` for chamada,
        // a condição `if (!gameStarted || isJumping)` será avaliada como falsa, permitindo que o código continue.
    }, 600); // 600ms é o tempo de duração do pulo, ou seja, o tempo que o personagem leva para completar o movimento de pulo.
};

const loop = setInterval(() => {
    if (!gameStarted) return; // Se o jogo não começou, não faz nada

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(orangutango).bottom.replace('px', '');

    if (pipePosition <= 110 && pipePosition > 0 && marioPosition < 70) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        orangutango.style.animation = 'none';
        orangutango.style.bottom = `${marioPosition}px`;

        orangutango.src = './imagens do game/fumaça.gif'; // Muda a imagem para a animação de "Game Over"
        orangutango.style.width = '200px'; // Ajusta a largura da imagem de "Game Over"
        orangutango.style.width = '180px';
        orangutango.style.marginLeft = '50px';

        clearInterval(loop);

        showGameOver(); // Chama a função para mostrar "Game Over"
    } else {
        updateScore(); // Atualiza a pontuação a cada iteração do loop
        if (ponto > highScore) {
            highScore = ponto; // Atualiza o recorde se a pontuação atual for maior
            localStorage.setItem('highScore', highScore); // Salva o novo recorde no localStorage
            document.getElementById('high-score').textContent = `Recorde: ${highScore}`; // Atualiza o recorde na tela
        }
    }
}, 10);

// Adiciona o evento de clique no botão de começar
document.getElementById('start-button').addEventListener('click', startGame);

// Adiciona um evento para detectar quando uma tecla é pressionada
document.addEventListener('keydown', (event) => {
    // Verifica se a tecla pressionada é a barra de espaço
    if (event.code === 'Space') {
        jump(); // Chama a função de pulo
        jumpSound.currentTime = 0; // Reinicia o som do pulo para evitar atrasos
        jumpSound.play(); // Toca o som do pulo
    }
});

// *** MUDANÇA: Controle para permitir o pulo ao segurar a tecla espaço ***
// Adiciona um evento para detectar quando uma tecla é solta
document.addEventListener('keyup', (event) => {
    // Verifica se a tecla solta é a barra de espaço
    if (event.code === 'Space') {
        isJumping = false; // Permite outro pulo ao soltar a tecla.
        // Isso acontece porque, ao soltar a tecla, o estado de `isJumping` é redefinido para `false`,
        // permitindo que a função `jump` seja chamada novamente quando a tecla for pressionada.
    }
});
// *** FIM DA MUDANÇA ***

function showGameOver() {
    const gameOverScreen = document.getElementById('game-over');
    gameOverScreen.classList.remove('hidden');
}

function restartGame() {
    location.reload(); // Reinicia a página
}
