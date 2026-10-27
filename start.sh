#!/usr/bin/env bash
# Start Smart Analyst Portal with Nginx in the background.
# Stop it with: ./start.sh stop
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
RUN="$ROOT/run"
PORT="${PORT:-8080}"

if [[ -x /opt/homebrew/bin/nginx ]]; then
  NGINX="/opt/homebrew/bin/nginx"
elif [[ -x /usr/local/bin/nginx ]]; then
  NGINX="/usr/local/bin/nginx"
elif command -v nginx >/dev/null 2>&1; then
  NGINX="$(command -v nginx)"
else
  echo "Nginx is not installed. Install it, then run this script again:" >&2
  echo "  brew install nginx" >&2
  exit 1
fi

mkdir -p \
  "$RUN/logs" \
  "$RUN/temp/client_body" \
  "$RUN/temp/proxy" \
  "$RUN/temp/fastcgi" \
  "$RUN/temp/uwsgi" \
  "$RUN/temp/scgi"

cat > "$RUN/nginx.conf" <<EOF
worker_processes 1;
daemon on;
error_log logs/error.log;
pid nginx.pid;

events {
    worker_connections 128;
}

http {
    types {
        text/html html htm;
        text/css css;
        application/javascript js;
        text/plain txt;
        image/svg+xml svg;
        image/png png;
        image/jpeg jpg jpeg;
        image/webp webp;
        image/gif gif;
    }
    default_type application/octet-stream;
    access_log logs/access.log;
    sendfile on;
    client_body_temp_path temp/client_body;
    proxy_temp_path temp/proxy;
    fastcgi_temp_path temp/fastcgi;
    uwsgi_temp_path temp/uwsgi;
    scgi_temp_path temp/scgi;

    server {
        listen ${PORT};
        server_name _;
        root ${ROOT};
        index index.html;

        location / {
            try_files \$uri \$uri/ =404;
        }
    }
}
EOF

running=0
if [[ -f "$RUN/nginx.pid" ]]; then
  pid="$(cat "$RUN/nginx.pid" 2>/dev/null || true)"
  if [[ -n "${pid}" ]] && kill -0 "$pid" 2>/dev/null; then
    running=1
  fi
fi

if [[ "${1:-}" == "stop" ]]; then
  if [[ "$running" -eq 1 ]]; then
    "$NGINX" -p "$RUN/" -c "$RUN/nginx.conf" -s quit
    echo "Stopped."
  else
    echo "Smart Analyst Portal is not running."
  fi
  exit 0
fi

if [[ "$running" -eq 1 ]]; then
  "$NGINX" -p "$RUN/" -c "$RUN/nginx.conf" -s reload
  action="Reloaded"
else
  "$NGINX" -p "$RUN/" -c "$RUN/nginx.conf"
  action="Started"
fi

lan_ip="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"

echo "${action}. Nginx is running in the background, so you can close this terminal."
echo "This computer:  http://localhost:${PORT}"
if [[ -n "$lan_ip" ]]; then
  echo "Other computers on this network:  http://${lan_ip}:${PORT}"
fi
echo "Stop it with:  ./start.sh stop"
