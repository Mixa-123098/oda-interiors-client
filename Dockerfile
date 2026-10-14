# Serves a bundle that ../deploy.sh has already built on the developer machine
# (REACT_APP_API_URL=/api npm run build). Building it in here, on the 2GB VPS,
# needed more memory than the server could spare next to Postgres, Umami and
# headless Chrome, and the kernel OOM-killed them on every deploy.
FROM nginx:alpine

COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
