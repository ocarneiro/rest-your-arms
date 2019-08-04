from pyfirmata import Arduino
import time
from bottle import route, run, template

board = Arduino('/dev/ttyUSB0')
servo1 = board.get_pin('d:9:s')
servo2 = board.get_pin('d:10:s')
servo1.write(90)
timestamp = None

@route('/hello/<pos>')
def index(pos):
    global timestamp
    if not timestamp:
        timestamp = time.time()
    elif time.time() - timestamp > 1:
        servo1.write(int(pos))
        timestamp = time.time()
    else:
        print("espere")
    return template('<b>Hello {{pos}}</b>!', pos=pos)

run(host='0.0.0.0', port=8080)
