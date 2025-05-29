---
title: "12 Months On: Self-Hosting"
date: 2025-05-29
draft: false
---
12 months ago, I decided to make the move to self-hosting and removing any dependancies from GCP and other cloud providers. This was thanks to my own <...> after accidentally leaving a GCP Cloud Workstation running for a few days. This and a few other services I had been toying around with ran me up around $434.74 in the 4 months from January to April last year. When I received my bill come May I decided enough was enough and I would commit to having $0 bills by the next month.

```mermaid
flowchart TD
    user((User))
    
    subgraph external-services [External Services]
        cloudflare[Cloudflare]
        cloudflare-dns[Cloudflare DNS]
    end
    
    subgraph homelab [Homelab Infrastructure]
        subgraph compute-nodes [Compute Nodes]
            node0[Node 0]
        end

        subgraph compose [Docker Compose]
            service-1[Service 1]
            service-2[Service 2]
            service-3[Service 3]
            service-4[Service 4]

            cloudflared[Cloudflared]
            traefik[Traefik]
        end
    end
    
    user --> cloudflare-dns
    cloudflare-dns --> cloudflare
    cloudflare --> cloudflared
    cloudflared --> traefik
    traefik --> service-1 & service-2 & service-3 & service-4

    compose -..-> node0
```

```mermaid
flowchart TD
    user((External User))
    local-user((Local User))

    subgraph external-services [External Services]
        cloudflare[Cloudflare]
        cloudflare-hosting[Cloudflare Hosting]
        cloudflare-dns[Cloudflare DNS]
    end

    subgraph homelab [Homelab Infrastructure]
        subgraph compute-nodes [Compute Nodes]
            subgraph pve [PVE Cluster]
                dev[Development Node]
                node0[Node 0]
            end

            tc0[Mini PC 0]
            tc1[Mini PC 1]
            tc2[Mini PC 2]
            tc3[Mini PC 3]
        end

        nas[(NAS Storage)]

        gateway[Gateway]

        subgraph swarm [Docker Swarm]
            service-1[Service 1]
            service-2[Service 2]
            service-3[Service 3]
            service-4[Service 4]

            cloudflared[Cloudflared]
            traefik[Traefik]
        end
    end

    local-user --> gateway
    gateway --> cloudflare-dns
    gateway --> traefik

    user --> cloudflare-dns
    cloudflare-dns --> cloudflare
    cloudflare --> cloudflared
    cloudflared --> traefik
    cloudflare --> cloudflare-hosting

    cloudflare-dns --> traefik

    traefik --> service-1 & service-2 & service-3 & service-4
    swarm -..-> node0 & tc0 & tc1 & tc2 & tc3
    dev & node0 & tc0 & tc1 & tc2 & tc3 --> nas
```