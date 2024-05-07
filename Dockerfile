FROM ubuntu:latest AS builder

RUN apt-get update && apt-get install -y hugo

WORKDIR /app

COPY ./archetypes ./archetypes
COPY ./i18n ./i18n

COPY ./themes ./themes

COPY ./nginx.conf ./nginx.conf
COPY ./CNAME ./CNAME
COPY ./config.yml ./config.yml

COPY ./static ./static
COPY ./content ./content

RUN hugo

FROM nginx:latest AS final

COPY --from=builder /app/public /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
