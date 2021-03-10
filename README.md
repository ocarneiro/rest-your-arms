# Rest Your Arms (Descanse os braços)

Interface rest para movimentar braços de robô usando inteligência artificial.

O propósito deste projeto é criar um robõ que imita os movimentos de uma pessoa em frente à câmera.

No momento estão disponíveis as seguintes demonstrações:

* [angulos](angulos): cálculo do ângulo formado entre o ombro e a mão direita, em graus, a partir da imagem da webcam.
* [ark-local](ark-local): protótipo de game no estilo Arkanoid em que a posição dos pulsos da pessoa sendo filmada controlam as raquetes. Este exemplo usa um modelo de poses já treinado e disponível localmente (cerca de 5MB);
* [ark-p5](ark-p5): protótipo como o ark-local, mas utilizando modelo obtido da internet, buscado automaticamente pela biblioteca ml5.js;
* [arms-p5](arms-p5): desenha pontos e linhas como referência para controle de robô;
* [backend](backend): servidor python usando bottle e pyFirmata para controlar servo conectado a um Arduino;
* [dois_angulos](dois_angulos): calcula ângulos formados entre cada ombro e a mão correspondente a partir de imagem da webcam.
* [pong-local](pong-local): simulação do game Pong usando a posição das mãos para as raquetes. Usa um modelo posenet baixado localmente.
* [posenet-local](posenet-local): implantação mínima da aplicação de um modelo local posenet.


## Experimente online!

https://editor.p5js.org/ocarneiro/sketches/gTyXyAxfQ

https://editor.p5js.org/ocarneiro/sketches/xSncWFkcg

## Inspirações

https://editor.p5js.org/codingtrain/sketches/Skd42hIy4

https://storage.googleapis.com/tfjs-models/demos/posenet/camera.html

https://github.com/oveddan/posenet-for-installations (para rodar offline)
