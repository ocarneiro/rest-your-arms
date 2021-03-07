from pyfirmata import Arduino
import time
from bottle import route, run, template

arduino_presente = True

# tempo em segundos permitido entre envio de comandos ao Arduino
tempo_entre_execucoes = 10

try:
    # Tenta conexão com um Arduino que esteja usando o código StandardFirmata
    board = Arduino('/dev/ttyACM0')   # define porta usada pelo Arduino
    servo1 = board.get_pin('d:9:s')   # conecta servo no pino 9
    servo2 = board.get_pin('d:10:s')  # conecta servo no pino 10
    servo1.write(90)
    servo2.write(90)

except:
    print("Iniciando sem um arduino")
    arduino_presente = False

hora_ultima_execucao = time.time()

@route('/braco/<pos>')
def index(pos):
    print("Recebi %s" % pos)
    global hora_ultima_execucao
    hora_atual = time.time()
    if hora_atual - hora_ultima_execucao > tempo_entre_execucoes:
        if arduino_presente:
            servo1.write(int(pos))
        else:
            print("Servo: %s" % pos)
        timestamp = time.time()
    else:
        print("Espere %d segundos" % int(tempo_entre_execucoes
                                         - (hora_atual
                                         - hora_ultima_execucao)
                                        )
              )
    return template('<b>Hello {{pos}}</b>!', pos=pos)

run(host='0.0.0.0', port=8080)
