#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import sys

class RequestHandlerWithCustomHeaders (SimpleHTTPRequestHandler):
    def end_headers (self):
        # CORS: self.send_header('Access-Control-Allow-Origin', '*')
        # X-Content-Type-Options: nosniff
        # self.send_header('X-Content-Type-Options', 'nosniff')
        # Accept-Ranges: bytes
        self.send_header('Accept-Ranges', 'bytes')
        # Content-Encoding: gzip
        # self.send_header('Content-Encoding', 'gzip')
        # cache-control: no-transform
        self.send_header('cache-control', 'no-transform')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    test(RequestHandlerWithCustomHeaders, HTTPServer, port=int(sys.argv[1]) if len(sys.argv) > 1 else 8000)