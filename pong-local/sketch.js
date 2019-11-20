let webcamvideo;
let canvas;
let model;
const tamanho = {x: 640, y: 480}
let maoEsquerda = {x: 30, y: tamanho.y/2};
let maoDireita = {x: tamanho.x - 50, y: tamanho.y/2};
let bola = {x: tamanho.x/2, y: 0};

let velY = 6;
let velX = 6;

let confianca = 0;


// carrega o modelo PoseNet
async function loadMyModel() {
	
    const config = {
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 417, //  { width: 640, height: 480 },
      multiplier: 0.75,
      modelUrl: '/models/075/model-stride16.json'
    };
    
	const net = await posenet.load(config); 
  return net;
}

// estima pose a partir de um modelo e uma imagem
async function estimate(net, imageElement) {

	const imageScaleFactor = 0.5;
  const outputStride = 16;
  const flipHorizontal = false;
	
  const pose = await net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride);
  return pose;
}

// função executada pelo p5.js inicialmente
async function setup() {
  frameRate(15);
  createCanvas(tamanho.x, tamanho.y);
  canvas = document.getElementsByClassName("p5Canvas")[0];
  canvas.width = tamanho.x;
  canvas.height = tamanho.y;
  webcamvideo = createCapture(VIDEO);
  webcamvideo.hide();
  
  model = await loadMyModel();
  await estimate(model, canvas);
}

function getPosicaoAtualEstimada(pose, chave) {
  let x = pose.keypoints[chave].position.x;
  let y = pose.keypoints[chave].position.y;
  return {x: x, y: y};
}

// pose = objeto do PoseNet
// chave = número do keypoint (ex: 0 = nariz)
// ponto = array de duas posições (x e y) a ser alterado
// suavizacao = grau de lerping
function mudaPosicao(pose, chave, ponto, suavizacao) {
    let pontoEstimado = getPosicaoAtualEstimada(pose, chave);
    ponto.x = lerp(ponto.x, pontoEstimado.x, suavizacao);
    ponto.y = lerp(ponto.y, pontoEstimado.y, suavizacao);
    if (ponto.y > tamanho.y - 30) {
      ponto.y = tamanho.y - 30
    }
    return ponto;
}

function atualizaPosicoes(pose) {
  confianca = pose.score;
  // console.log(pose);
  if (pose.score > 0.3) {
    let novaPosicaoEsquerda = getPosicaoAtualEstimada(pose, 9);
    if (novaPosicaoEsquerda.x < tamanho.x / 2) {
        maoEsquerda = mudaPosicao(pose, 9, maoEsquerda, 0.7);
    }
    let novaPosicaoDireita = getPosicaoAtualEstimada(pose, 10);
    if (novaPosicaoDireita.x > tamanho.x / 2) {
        maoDireita = mudaPosicao(pose, 10, maoDireita, 0.7);
    }
  }
}

// função executada pelo p5.js a cada frame
async function draw() {

  scale(0.5);

  // mostra vídeo espelhado horizontalmente
  //    no tamanho do canvas
  scale(-1, 1);
  image(webcamvideo, -tamanho.x, 0);
  scale(-1, 1);
  
  estimate(model, canvas).then(atualizaPosicoes);

  fill(255, 255, 255);
  textSize(32);
  text(confianca, 5, tamanho.y - 10);

  // desenha bola verde
  stroke(255, 255, 255); 
  fill(0, 255, 0);
  ellipse(bola.x, bola.y, 20);

  // aplica velocidades à bola
  bola.y = bola.y + velY;
  bola.x = bola.x + velX;

  // desenha raquetes
  fill(0, 0, 255);
  stroke(255, 255, 255);
  rect(maoEsquerda.x, maoEsquerda.y, 20, 60, 10);
  rect(maoDireita.x, maoDireita.y, 20, 60, 10);

  // trata colisões
  /*
  if (bola.y > 460  &&
       bola.x > xMaoDir  &&
       bola.x < xMaoDir + 60) {
    velY = -20;
    if (bola.x > xMaoDir + 30) {
      velX = 3;
    } else {
      velX = -3;
    }
  }
  if (bola.y > 460  &&
       bola.x > xMaoEsq  &&
       bola.x < xMaoEsq + 60) {
    velY = -20;
    if (bola.x > xMaoEsq + 30) {
      velX = 3;
    } else {
      velX = -3;
    }
  }
  */

  // bola passando limite vertical
  if (bola.y > tamanho.y) {
    velY = - velY;
  } else if (bola.y < 0) {
    velY = - velY;
  } 

  // bola passando limite horizontal
  if (bola.x > tamanho.x) {
    bola.x = 0;
  }
  if (bola.x < 0) {
    bola.x = tamanho.x;
  }

}
