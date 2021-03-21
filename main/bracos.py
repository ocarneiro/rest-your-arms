from pyfirmata import Arduino
import time
from bottle import route, run, template, static_file, response

arduino_presente = True
POSICAO_INICIAL = 90


# tempo em segundos permitido entre envio de comandos ao Arduino
tempo_entre_execucoes = 10

try:
    # Tenta conexão com um Arduino que esteja usando o código StandardFirmata
    board = Arduino('/dev/ttyACM0')   # define porta usada pelo Arduino
    servo1 = board.get_pin('d:9:s')   # conecta servo no pino 9
    servo2 = board.get_pin('d:10:s')  # conecta servo no pino 10
    servo1.write(POSICAO_INICIAL)
    servo2.write(POSICAO_INICIAL)

except:
    print("Iniciando sem um arduino")
    arduino_presente = False

hora_ultima_execucao = time.time()

def posicionaServos(esquerda,direita):
    if arduino_presente:
        servo1.write(int(esquerda))
        servo2.write(int(direita))
    else:
        print("ServoDir: %d" % direita)
        print("ServoEsq: %d" % esquerda)

@route('/static')
@route('/static/<filename:path>')
def send_static(filename="index.html"):
    return static_file(filename, root='./html')

@route('/bracos/<pos>')
def index(pos):
    print("Recebi %s" % pos)
    pos1, pos2 = pos.split(",")
    try:
        posEsq, posDir = int(pos1),int(pos2)
    except ValueError:
        response.status = 400
        return '''Argumentos inválidos: %s
                  Informe dois inteiros entre vírgulas.
                  ex: http://servidor:porta/12,95''' % pos
    global hora_ultima_execucao
    hora_atual = time.time()
    if hora_atual - hora_ultima_execucao > tempo_entre_execucoes:
        posicionaServos(posEsq,posDir)
        timestamp = time.time()
    else:
        response.status = 202
        return "Espere %d segundos" % int(tempo_entre_execucoes
                                          - (hora_atual
                                          - hora_ultima_execucao)
                                          )
    return {'esquerda': posEsq, 'direita': posDir}

run(host='0.0.0.0', port=8080, reloader=True)
