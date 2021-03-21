let video;
let poseNet;
let tamanho = {x: 640, y: 480}
let ombroEsquerdo = {x: tamanho.x/2, y: tamanho.y/2};
let maoEsquerda = {x: tamanho.x/2, y: tamanho.y/2};
let ombroDireito = {x: tamanho.x/2, y: tamanho.y/2};
let maoDireita = {x: tamanho.x/2, y: tamanho.y/2};
let anguloDireito;
let anguloEsquerdo;
let loadedJSON = null;
let ligado = false;

let frameAtual = 0;
let frameAcao = 5;
 
function setup() {
  createCanvas(tamanho.x, tamanho.y);
  frameRate(10); 
  let constraints = {
    video: {
      mandatory: {
        minWidth: tamanho.x,
        minHeight: tamanho.y
      }
    },
    audio: false
  };
  video = createCapture(constraints);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);

}

function moveServo() {
  // console.log("Braço esquerdo: " + anguloEsquerdo);
  anguloServoBracoDireito = anguloServoFromBracoEsquerdo(anguloEsquerdo);
  anguloServoBracoEsquerdo = anguloServoFromBracoDireito(anguloDireito);
  // console.log("Vou enviar: " + anguloServoBracoEsquerdo);
  loadedJSON = loadJSON(
"http://localhost:8080/bracos/" 
  + anguloServoBracoEsquerdo
  + ","
  + anguloServoBracoDireito, onURLload); 
}

/**
 * Define o ângulo a ser passado para o servo 
 * a partir o braço esquerdo da pessoa.
 */
function anguloServoFromBracoEsquerdo(anguloBraco) {
  MINIMO_BRACO = 90;
  MINIMO_SERVO = 15;
  MAXIMO_BRACO = 180;
  MAXIMO_SERVO = 90;
  
  anguloServo = 90;
  if (anguloBraco > 0 && anguloBraco <= 90) {
    anguloServo = MINIMO_SERVO; // posicao mais alta
  } else if (anguloBraco >= MINIMO_BRACO && anguloBraco <= MAXIMO_BRACO) {
    novoAngulo = anguloBraco - MINIMO_BRACO;
    novoMaximo = MAXIMO_BRACO - MINIMO_BRACO;
    indiceNovoAngulo = novoAngulo / novoMaximo;
    escalaDestino = MAXIMO_SERVO - MINIMO_SERVO;
    novoAngulo = indiceNovoAngulo * escalaDestino + MINIMO_SERVO;
    anguloServo = novoAngulo;
  // o braço fica com ângulo negativo quando a mão esquerda
  // está abaixo da linha do ombro (-180 a -90 graus)
  } else if (anguloBraco < 0) {
    MINIMO_BRACO = -180;
    MAXIMO_BRACO = -90;
    MINIMO_SERVO = 90;
    MAXIMO_SERVO = 175;
    // se mão estiver cruzando a frente do corpo,
    // a posição do servo é a mais baixa
    anguloServo = 90;
    if (anguloBraco > -90) {
      anguloServo = MAXIMO_SERVO;
    // entre -90 e -180
    } else {
        novoAngulo = anguloBraco - MINIMO_BRACO;
        novoMaximo = MAXIMO_BRACO - MINIMO_BRACO;
        indiceNovoAngulo = novoAngulo / novoMaximo;
        escalaDestino = MAXIMO_SERVO - MINIMO_SERVO;
        novoAngulo = indiceNovoAngulo * escalaDestino + MINIMO_SERVO;
        anguloServo = novoAngulo;      
    }
  }
  return Math.trunc(anguloServo);
}

/**
 * Define o ângulo a ser passado para o servo 
 * a partir o braço direito da pessoa.
 */
function anguloServoFromBracoDireito(anguloBraco) {
  MINIMO_BRACO = -90;
  MINIMO_SERVO = 15;
  MAXIMO_BRACO = 90;
  MAXIMO_SERVO = 175;
  
  anguloServo = 15;
  if (anguloBraco>90) anguloServo = 175;
  if (anguloBraco < 90 && anguloBraco > -90) {
    novoAngulo = anguloBraco - MINIMO_BRACO;
    novoMaximo = MAXIMO_BRACO - MINIMO_BRACO;
    indiceNovoAngulo = novoAngulo / novoMaximo;
    escalaDestino = MAXIMO_SERVO - MINIMO_SERVO;
    novoAngulo = indiceNovoAngulo * escalaDestino + MINIMO_SERVO;
    anguloServo = novoAngulo;
  }
  return Math.trunc(anguloServo);
}

function onURLload() {
  console.log("Peguei: " + JSON.stringify(loadedJSON));
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
    ombroEsquerdo = mudaPosicao(poses, 5, ombroEsquerdo, 0.8);
    maoEsquerda = mudaPosicao(poses, 9, maoEsquerda, 0.6);
    ombroDireito = mudaPosicao(poses, 6, ombroDireito, 0.8);
    maoDireita = mudaPosicao(poses, 10, maoDireita, 0.6);
    
  }
}

function modelReady() {
  console.log('modelo pronto');
}

// função executada a cada frame
function draw() {
  // desenha espelhando horizontalmente
  scale(-1,1);
  image(video, -tamanho.x, 0);
  desenhaOmbroMao(ombroDireito, maoDireita);
  desenhaOmbroMao(ombroEsquerdo, maoEsquerda);
  
  // volta ao modo normal para escrever
  scale(-1,1);
  fill(255, 255, 255);
  textSize(32);
  anguloDireito = calculaAngulo(ombroDireito, maoDireita);
  anguloEsquerdo = calculaAngulo(ombroEsquerdo, maoEsquerda);
  textSize(64);
  text(anguloDireito + "º",tamanho.x - 160, 75);
  text(anguloEsquerdo + "º", 100, 75);

  desenhaBolas();
  desenhaLigado();

}

function ligaDesliga() {
  ligado = ! ligado;
}

function desenhaLigado() {
  stroke(255, 255, 255); // cor da linha
  strokeWeight(4); // espessura
  if (ligado) {
    fill(255, 0, 0);
  } else {
    fill(0, 255, 0);
  }
  ellipse(tamanho.x-70, tamanho.y-120, 60);  
  button = createButton('Power');
  button.position(tamanho.x-97, tamanho.y-130);
  button.mousePressed(ligaDesliga);
}

function desenhaBolas() {
  
  frameAtual = frameAtual + 1;
  espacamento = Math.trunc(tamanho.x / (frameAcao+1));
  for (var i = 1; i <= frameAcao; i++){
    if (i == frameAtual) {
      stroke(255, 255, 255); // cor da linha
      strokeWeight(1); // espessura
      fill(255, 0, 0);
    } else {
      stroke(255, 255, 255); // cor da linha
      strokeWeight(1); // espessura
      fill(0, 255, 0);
    }
    ellipse(i*espacamento, tamanho.y-30, 10);   
  }
  if (frameAtual >= frameAcao) {
    // console.log("Vai!");
    if (ligado) {
      moveServo();
    }
    frameAtual = 0;
  }
}

function calculaAngulo(ombro, mao) {
  cateto_oposto = Math.trunc(ombro.y) - Math.trunc(mao.y);
  cateto_adjacente = Math.trunc(ombro.x) - Math.trunc(mao.x);
  atan_calculado = Math.atan2(cateto_oposto, cateto_adjacente);
  angulo = Math.floor(atan_calculado * 180 /Math.PI);
  return angulo;
}

function desenhaOmbroMao(ombro, mao) {
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
