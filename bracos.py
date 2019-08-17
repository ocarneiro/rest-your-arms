from pyfirmata import Arduino
import time
from bottle import route, run, template

arduino_presente = True

try:
    board = Arduino('/dev/ttyUSB0')
    servo1 = board.get_pin('d:9:s')
    servo2 = board.get_pin('d:10:s')
    servo1.write(90)
except:
    print("Iniciando sem um arduino")
    arduino_presente = False
timestamp = None

@route('/hello/<pos>')
def index(pos):
    global timestamp
    if not timestamp:
        timestamp = time.time()
    elif time.time() - timestamp > 1:
        if arduino_presente:
            servo1.write(int(pos))
        else:
            print("Servo: %s" % pos)
        timestamp = time.time()
    else:
        print("espere")
    return template('<b>Hello {{pos}}</b>!', pos=pos)

run(host='0.0.0.0', port=8080)
