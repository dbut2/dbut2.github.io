---
title: Self-hosted traffic ingress
date: 2024-05-13
draft: false
tags:
  - self-hosted
---
A quick snippet of my docker compose config for managing traffic ingress into my self-hosted setup.

Cloudflare Zero Trust tunnel is being used to manage forwarding traffic from the public internet to my machine as I didn’t want to expose my network directly.

Exiting the tunnel, cloudflare has been setup to direct all traffic to `traefik:80` which is exposed on the ingress network.

Based on rules defined on each service, traefik will the route the traffic to each of those services:

```yaml
services:
  tunnel:
    image: cloudflare/cloudflared
    command:
      - "tunnel"
      - "run"
    environment:
      - "TUNNEL_TOKEN=${TUNNEL_TOKEN}"
    networks:
      - ingress

  traefik:
    container_name: traefik
    image: traefik
    command:
      - "--entrypoints.web.address=:80"
      - "--providers.docker=true"
      - "--providers.docker.network=web"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    networks:
      - ingress
      - web

networks:
  ingress:
    driver: bridge
  web:
    driver: bridge
```

An example config for a service that routes traffic bound for example.com:

```yaml
services:
  ...
  hello-world:
    image: nginxdemos/hello
    labels:
      - "traefik.http.routers.hello-world.rule=Host(`example.com`)"
    networks:
      - web
```