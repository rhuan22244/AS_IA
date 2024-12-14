const tabuleiro = Array(8).fill(null).map(() => Array(8).fill(null));

const pecas = [
    { tipo: 'R', posicao: { x: 0, y: 0 }, cor: 'branco' }, // Rei
    { tipo: 'B', posicao: { x: 7, y: 7 }, cor: 'preto' }   // Bispo
];

// Exibe o tabuleiro
const exibirTabuleiro = () => {
    console.clear();
    console.log('Tabuleiro:');
    for (let y = 0; y < 8; y++) {
        let linha = '';
        for (let x = 0; x < 8; x++) {
            const peca = pecas.find(p => p.posicao.x === x && p.posicao.y === y);
            linha += peca ? ` ${peca.tipo} ` : ' . ';
        }
        console.log(linha);
    }
    console.log('\n');
};

// Move uma peça de forma aleatória
const moverPeca = (peca) => {
    const direcoes = [
        { dx: -1, dy: 0 }, // Esquerda
        { dx: 1, dy: 0 },  // Direita
        { dx: 0, dy: -1 }, // Cima
        { dx: 0, dy: 1 }   // Baixo
    ];

    const movimento = direcoes[Math.floor(Math.random() * direcoes.length)];
    const novaPosicao = {
        x: peca.posicao.x + movimento.dx,
        y: peca.posicao.y + movimento.dy
    };

    // Verifica se o movimento é válido (dentro do tabuleiro)
    if (novaPosicao.x >= 0 && novaPosicao.x < 8 && novaPosicao.y >= 0 && novaPosicao.y < 8) {
        peca.posicao = novaPosicao;
    }
};

// Jogo principal
const jogar = () => {
    let turnos = 0;

    console.log('Início do jogo!');
    exibirTabuleiro();

    const intervalo = setInterval(() => {
        console.log(`Turno: ${++turnos}`);
        pecas.forEach(moverPeca);
        exibirTabuleiro();

        // Fim do jogo: quando o rei e o bispo estiverem na mesma posição
        if (pecas[0].posicao.x === pecas[1].posicao.x && pecas[0].posicao.y === pecas[1].posicao.y) {
            console.log('Fim de jogo! Rei capturou o bispo!');
            clearInterval(intervalo);
        }
    }, 1000);
};

jogar();
