from pyfirmata import Arduino
import time
from bottle import route, run, template

board = Arduino('/dev/ttyUSB0')
servo1 = board.get_pin('d:9:s')
servo2 = board.get_pin('d:10:s')

@route('/hello/<pos>')
def index(pos):
    servo1.write(int(pos))
    return template('<b>Hello {{pos}}</b>!', pos=pos)

run(host='0.0.0.0', port=8080)
