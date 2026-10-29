#!/usr/bin/env python3
"""Start OmniFile locally using only the Python standard library."""
from __future__ import annotations

import os
import socket
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"


class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        print("[OmniFile] " + (fmt % args))


def available_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind((HOST, 0))
        return int(sock.getsockname()[1])


def main() -> None:
    os.chdir(ROOT)
    port = available_port()
    server = ThreadingHTTPServer((HOST, port), QuietHandler)
    url = f"http://{HOST}:{port}/"
    print("\nOmniFile is running locally.")
    print(f"Open: {url}")
    print("Keep this terminal open while using OmniFile.")
    print("Press Ctrl+C to stop the server.\n")
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping OmniFile…")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
