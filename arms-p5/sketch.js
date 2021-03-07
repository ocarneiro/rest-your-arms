let video;
let poseNet;
let tamanho = {x: 640, y: 480}
let ombroEsquerdo = {x: tamanho.x/2, y: tamanho.y/2};
let maoEsquerda = {x: tamanho.x/2, y: tamanho.y/2};
let ombroDireito = {x: tamanho.x/2, y: tamanho.y/2};
let maoDireita = {x: tamanho.x/2, y: tamanho.y/2};

 
function setup() {
  createCanvas(tamanho.x, tamanho.y);
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
    
  }
}

function modelReady() {
  console.log('model ready');
}

function draw() {
  // desenha espelhando horizontalmente
  scale(-1,1);
  image(video, -tamanho.x, 0);
  desenhaOmbroMao(ombroEsquerdo, maoEsquerda);
  desenhaOmbroMao(ombroDireito, maoDireita);
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
