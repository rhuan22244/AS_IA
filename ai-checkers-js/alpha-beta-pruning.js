// Função para avaliar o valor de um movimento
const avaliarMovimento = (movimento, incremento = 0) => {
    let soma = 0;

    if ('remover' in movimento) {
        if (movimento["pecaRemovida"][1].toLowerCase() === "p") {
            soma += 20 + incremento;
        } else {
            soma += 60 + incremento;
        }
    }

    if ('promocao' in movimento) {
        soma += 40;
    }

    if ('proximaCaptura' in movimento) {
        soma += avaliarMovimento(movimento.proximaCaptura);
    }

    return soma;
};

// Implementação do algoritmo MinMax com poda alfa-beta
const minmax = (posicao, profundidade, alfa, beta, jogadorMaximizante, soma, turno, cor) => {
    let totalNos = 0;
    totalNos++;

    // Obtém todos os movimentos disponíveis para o jogador no turno atual
    let movimentos = obterTodosMovimentos(turno, posicao).reduce((arr, mov) => {
        espalharProximasCapturas(mov).forEach(mov2 => arr.push(mov2));
        return arr;
    }, []);

    movimentos.sort(() => Math.random() - Math.random()); // Aleatorização para evitar padrões fixos

    if (profundidade === 0 || movimentos.length === 0) {
        return [null, soma];
    }

    let valorMax = Number.NEGATIVE_INFINITY;
    let valorMin = Number.POSITIVE_INFINITY;
    let melhorMovimento;

    for (let i = 0; i < movimentos.length; i++) {
        let movimento = movimentos[i];
        let novaSoma;
        let novaPosicao = posicao;
        let novoMovimento = { ...movimento };
        let novoTurno;

        while ("proximaCaptura" in novoMovimento) {
            novaPosicao = moverPeca(novoMovimento, novaPosicao);
            novoMovimento = novoMovimento.proximaCaptura;
        }

        novaPosicao = moverPeca(novoMovimento, novaPosicao);

        if (turno === cor) {
            novaSoma = soma + avaliarMovimento(movimento, profundidade);
        } else {
            novaSoma = soma - avaliarMovimento(movimento, profundidade);
        }

        if (movimento['peca'][1].toLowerCase() === "p") {
            if (movimento['de'][1] === 1 && turno === cor && turno === "branco") {
                novaSoma -= 10;
            } else {
                novaSoma += 10;
            }

            if (movimento['de'][1] === 8 && turno === cor && turno === "preto") {
                novaSoma -= 10;
            } else {
                novaSoma += 10;
            }
        }

        novoTurno = turno === "branco" ? "preto" : "branco";

        const [melhorMovimentoFilho, valorFilho] = minmax(novaPosicao, profundidade - 1, alfa, beta, !jogadorMaximizante, novaSoma, novoTurno, cor);

        if (jogadorMaximizante) {
            if (valorFilho > valorMax) {
                valorMax = valorFilho;
                melhorMovimento = movimento;
            }

            if (valorFilho > alfa) {
                alfa = valorFilho;
            }

        } else {
            if (valorFilho < valorMin) {
                valorMin = valorFilho;
                melhorMovimento = movimento;
            }
            if (valorFilho < beta) {
                beta = valorFilho;
            }
        }

        // Poda alfa-beta
        if (alfa >= beta) {
            break;
        }
    }

    return jogadorMaximizante ? [melhorMovimento, valorMax] : [melhorMovimento, valorMin];
};
