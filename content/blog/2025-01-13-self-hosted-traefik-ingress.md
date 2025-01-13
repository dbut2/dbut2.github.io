---
title: Self-hosted traefik ingress
date: 2024-05-13
draft: false
---
A quick snippet of my docker compose config for managing traffic ingress into my self-hosted setup.Cloudflare Zero Trust tunnel is being used to manage forwarding traffic from the public internet to my machine as I didn’t want to expose my network directly.Exiting the tunnel, cloudflare has been setup to direct all traffic to traefik:80 which is exposed on the ingress network.Based on rules defined on each service, traefik will the route the traffic to each of those [service.services](http://service.services):  
  tunnel:  
    image: cloudflare/cloudflared  
    command:

*   "tunnel"
    
*   "run"
    

    environment:

*   "TUNNEL\_TOKEN=${TUNNEL\_TOKEN}"
    

    networks:

*   ingress
    

  traefik:  
    container\_name: traefik  
    image: traefik  
    command:

*   "--entrypoints.web.address=:80"
    
*   "--entrypoints.traefik.address=:8080"
    
*   "--api.dashboard=true"
    
*   "--providers.docker=true"
    
*   "--[providers.docker.network](http://providers.docker.network)\=web"
    

    volumes:

*   "/var/run/docker.sock:/var/run/docker.sock"
    

    networks:

*   ingress
    
*   web
    

networks:  
  ingress:  
    driver: bridge  
  web:  
    driver: bridge  
compose.yamlAn example config for a service that routes traffic bound for [example.com.services](http://example.com.services):  
  ...  hello-world:  
    image: nginxdemos/hell[o label](http://example.com/)s:

*   "traefik.http.routers.hello-world.rule=Host(\`[example.com](http://example.com)\`)"
    

    networks:

*   web
    

amended compose.yaml