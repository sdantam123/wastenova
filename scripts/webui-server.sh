#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEBUI_DIR="$ROOT_DIR/webUI"
LOG_DIR="$ROOT_DIR/logs"
WEBUI_LOG="$LOG_DIR/webui.log"
PID_FILE="$LOG_DIR/webui.pid"

mkdir -p "$LOG_DIR"

start_webui() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Web UI is already running."
    return 0
  fi

  cd "$WEBUI_DIR"
  if [ ! -d node_modules ]; then
    echo "Installing frontend dependencies..."
    npm install
  fi

  nohup npm run dev -- --host 127.0.0.1 --port 5173 >"$WEBUI_LOG" 2>&1 &
  echo $! > "$PID_FILE"
  echo "Web UI started on http://127.0.0.1:5173"
}

stop_webui() {
  if [ -f "$PID_FILE" ]; then
    PID="$(cat "$PID_FILE")"
    if kill -0 "$PID" 2>/dev/null; then
      kill "$PID"
      echo "Web UI stopped."
    else
      echo "Web UI was not running."
    fi
    rm -f "$PID_FILE"
  else
    echo "Web UI was not running."
  fi
}

status() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Web UI status: running"
  else
    echo "Web UI status: stopped"
  fi
}

usage() {
  echo "Usage: $0 {start|stop|restart|status}"
  echo "  start   - start the React/Vite web UI"
  echo "  stop    - stop the web UI"
  echo "  restart - restart the web UI"
  echo "  status  - show the current web UI status"
}

case "${1:-}" in
  start)
    start_webui
    ;;
  stop)
    stop_webui
    ;;
  restart)
    stop_webui || true
    start_webui
    ;;
  status)
    status
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage
    exit 1
    ;;
 esac
