from pyfirmata import Arduino
import time
from bottle import route, run, template

arduino_presente = True

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

timestamp = time.time()

@route('/braco/<pos>')
def index(pos):
    print("Recebi %s" % pos)
    global timestamp
    if time.time() - timestamp > 10:
        if arduino_presente:
            servo1.write(int(pos))
        else:
            print("Servo: %s" % pos)
        timestamp = time.time()
    else:
        print("espere")
    return template('<b>Hello {{pos}}</b>!', pos=pos)

run(host='0.0.0.0', port=8080)
