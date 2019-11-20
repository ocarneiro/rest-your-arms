let video;
let model;
let tamanho = {x: 640, y: 480}
let ombroEsquerdo = {x: tamanho.x/2, y: tamanho.y/2};
let maoEsquerda = {x: tamanho.x/2, y: tamanho.y/2};
let ombroDireito = {x: tamanho.x/2, y: tamanho.y/2};
let maoDireita = {x: tamanho.x/2, y: tamanho.y/2};
let bola = {x: tamanho.x/2, y: tamanho.y - 20};

const GRAVIDADE = 2;
let xMaoEsq = 280;
let xMaoDir = 360;
let velY = 5;
let velX = 0;


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

async function estimate(net, imageElement) {

	var imageScaleFactor = 0.5;
    var outputStride = 16;
    var flipHorizontal = false;
	
    const pose = await net.estimateSinglePose(imageElement, imageScaleFactor, flipHorizontal, outputStride);
    console.log(pose);
}

async function setup() {
  frameRate(10);
  createCanvas(tamanho.x, tamanho.y);
  var canvas = document.getElementsByClassName("p5Canvas")[0];
  video = createCapture(VIDEO);
  video.hide();
  
  model = await loadMyModel();
  await estimate(model, canvas);
}

function logNomesDasPartes(poses) {
    for (var i = 0; i <= 16; i++){
      console.log(i + " = " + poses[0].pose.keypoints[i].part);
//  0 = nose
//  1 = leftEye
//  2 = rightEye
//  3 = leftEar
//  4 = rightEar
//  5 = leftShoulder
//  6 = rightShoulder
//  7 = leftElbow
//  8 = rightElbow
//  9 = leftWrist
// 10 = rightWrist
// 11 = leftHip
// 12 = rightHip
// 13 = leftKnee
// 14 = rightKnee
// 15 = leftAnkle
// 16 = rightAnkle  
    } 
}

// poses = objeto do PoseNet
// chave = número do keypoint (ex: 0 = nariz)
// ponto = array de duas posições (x e y) a ser alterado
// suavizacao = grau de lerping
function mudaPosicao(poses, chave, ponto, suavizacao) {
    let x = poses[0].pose.keypoints[chave].position.x;
    let y = poses[0].pose.keypoints[chave].position.y;
    ponto.x = lerp(ponto.x, x, suavizacao);
    ponto.y = lerp(ponto.y, y, suavizacao);
    return ponto;
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    ombroEsquerdo = mudaPosicao(poses, 5, ombroEsquerdo, 0.5);
    maoEsquerda = mudaPosicao(poses, 9, maoEsquerda, 0.3);
    ombroDireito = mudaPosicao(poses, 6, ombroDireito, 0.5);
    maoDireita = mudaPosicao(poses, 10, maoDireita, 0.3);
    xMaoEsq = tamanho.x - maoEsquerda.x;
    xMaoDir = tamanho.x - maoDireita.x;
  }
}

function modelReady() {
  console.log('model ready');
  bola.y = 20;
}

async function draw() {
  await estimate(model, canvas);
  // desenha espelhando horizontalmente
  scale(-1,1);
  image(video, -tamanho.x, 0);
  scale(-1,1);
  stroke(255, 255, 255); 
  fill(0, 255, 0);
  ellipse(bola.x, bola.y, 20);
  //desenhaOmbroMao(ombroEsquerdo, maoEsquerda);
  // desenhaOmbroMao(ombroDireito, maoDireita);
  bola.y = bola.y + velY;
  velY = velY + GRAVIDADE;
  bola.x = bola.x + velX;
  fill(0, 0, 255);
  stroke(255, 255, 255);
  rect(xMaoEsq, 460, 55, 15, 20);
  rect(xMaoDir, 460, 55, 15, 20);
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
  if (bola.y > tamanho.y + 50) {  // ERROU!!
    bola.x = Math.floor(Math.random()*tamanho.x);
    bola.y = 20;
    velY = 5;
    console.log("errou: " + xMaoEsq + "; " + bola.x);
  }
  
  if (bola.x > tamanho.x) {
    bola.x = tamanho.x;
    velX = -3;
  }
  if (bola.x < 0) {
    bola.x = 0;
    velX = 3;
  }
}

function desenhaOmbroMao(ombro, mao) {
  scale(-1,1);
  stroke(255, 255, 255); // cor da linha
  strokeWeight(4); // espessura
  // ajusta a posição x para o espelhamento
  line(ombro.x-tamanho.x, ombro.y, 
       mao.x-tamanho.x, mao.y);
  stroke(0, 0, 0); // cor da linha
  strokeWeight(1); // espessura
  fill(0, 0, 255);
  ellipse(ombro.x-tamanho.x, ombro.y, 10); 
  fill(0, 255, 0);
  ellipse(mao.x-tamanho.x, mao.y, 10);
  scale(-1,1);
}