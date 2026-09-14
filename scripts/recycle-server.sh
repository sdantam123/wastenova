#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PG_SERVICE="postgresql@17"
LOG_DIR="$ROOT_DIR/logs"
APP_LOG="$LOG_DIR/recycle-server.log"
PID_FILE="$LOG_DIR/recycle-server.pid"

mkdir -p "$LOG_DIR"

start_db() {
  if command -v brew >/dev/null 2>&1; then
    brew services start "$PG_SERVICE" >/dev/null 2>&1 || true
  else
    echo "Homebrew not found; cannot start PostgreSQL service."
    return 1
  fi

  echo "PostgreSQL 17 started."
}

stop_db() {
  if command -v brew >/dev/null 2>&1; then
    brew services stop "$PG_SERVICE" >/dev/null 2>&1 || true
  fi

  pkill -f "postgres -D /opt/homebrew/var/postgresql@17" >/dev/null 2>&1 || true
  echo "PostgreSQL 17 stopped."
}

start_backend() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Recycle backend is already running."
    return 0
  fi

  cd "$ROOT_DIR/server"
  if [ -f .venv/bin/activate ]; then
    . .venv/bin/activate
  fi

  nohup uvicorn app.main:app --reload --port 8000 >"$APP_LOG" 2>&1 &
  echo $! > "$PID_FILE"
  echo "Recycle backend started on http://127.0.0.1:8000"
}

stop_backend() {
  if [ -f "$PID_FILE" ]; then
    PID="$(cat "$PID_FILE")"
    if kill -0 "$PID" 2>/dev/null; then
      kill "$PID"
      echo "Recycle backend stopped."
    else
      echo "Recycle backend was not running."
    fi
    rm -f "$PID_FILE"
  else
    echo "Recycle backend was not running."
  fi
}

status() {
  if command -v brew >/dev/null 2>&1; then
    echo "PostgreSQL service status:"
    brew services list | grep "postgresql@17" || echo "  postgresql@17 not running"
  fi

  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Recycle backend status: running"
  else
    echo "Recycle backend status: stopped"
  fi
}

usage() {
  echo "Usage: $0 {start|stop|restart|status}"
  echo "  start   - start PostgreSQL 17 and the FastAPI backend"
  echo "  stop    - stop the FastAPI backend and PostgreSQL 17"
  echo "  restart - restart both services"
  echo "  status  - show current status"
}

case "${1:-}" in
  start)
    start_db
    start_backend
    ;;
  stop)
    stop_backend
    stop_db
    ;;
  restart)
    stop_backend || true
    stop_db || true
    start_db
    start_backend
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
