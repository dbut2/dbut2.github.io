---
title: "12 Months On: Self-Hosting"
date: 2025-05-29
draft: false
---
This is kind of a review on the past 12 months since moving my cloud hosted services to all self-hosted, and the sequence of upgrades and changes to my homelab throughout the process.

After a few months of increasingly larger GCP bills, and a final month of accidentally leaving a Cloud Workstation running for a little too long, I decided to give the old self-hosted world a try again after having most of my projects running somewhere in the cloud for the past 5 years, and seeing if I could pull off a $0 GCP bill the end of the next month.

The first thing was to pull out a gaming PC I bought a few years before, but had switched off some time ago due to using the XBOX as the gaming rig instead. The PC was a mid-specced computer with an RTX 3060, 6-core 3.9GHz processor, and some 16GB of memory, enough to at least get started.

At the time I booted everything up, I was still running all of my local devices 100% over Wi-Fi, and running on a 5G Home Mobile connection. I already had Ubuntu formatted onto one of the drives for whatever reason, and docker was naturally already running. The 5G connection presented it's first point of contention with the lack of any ability for statically setting an IP address at least having some stability in a dynamically assigned address.

One option considered was to use a Dynamic DNS service, but given the TTL on the domain would need to be set so low to not cause significant issue I looked for other options. I came across Cloudflare Zero Trust tunnels, which seemed to provide what I need: some stability in public facing domain names.

Once I had the tunnels figured out and running, I had my first basic setup running:

```mermaid
flowchart TD
    user((User))
    
    subgraph external-services [External Services]
        cloudflare-dns[Cloudflare DNS]
        cloudflare[Cloudflare Tunnel]
    end
    
    subgraph homelab [Homelab Infrastructure]
        subgraph compose [Docker Compose]
            cloudflared[Cloudflared]

            service-1[Uptime Kume]
            service-2[Jellyfin]
            service-3[Shlink]
        end

        subgraph compute-nodes [Compute Nodes]
            node0[Node 0]
        end
    end
    
    user --> cloudflare-dns
    cloudflare-dns --> cloudflare
    cloudflare --> cloudflared
    cloudflared --> service-1 & service-2 & service-3

    compose -..-> node0
```

This setup was my first step in being able to start turning off my Cloud Run services and other projects I had running on cloud. One of the services I had setup was Uptime Kuma, to ensure that all of my services were running fine. Unlike a local Docker instance, or running services on GCP, I didn't really have insight into what services were up, if any had crashed, or any level of insight without shelling into the machine and manually checking.

What Uptime Kuma highlighted was that occasionally and every few hours the requests to any of the services were timing out. Since it applied to all services across the board, I figured it must have to be something on the machine or the network. The logs on the machine and all services looked fine and didn't indicate they went down or anything similar, so I put this down to network issue.

Running services over Wi-Fi on a 5G connection probably wasn't the most stable setup I could have picked and so the first point of order was to wire the machine into my 5G modem/router directly. This seemed to solve some of the dropped connections but the issue still persisted. This mostly went on for a few months until I also upgraded the internet to a gigabit fibre connection when I realised my building supported it.

With the machine wired in and eventually move to a wired connection, this did resolve all of the issues I had seen before.

With everything running stable it was time to actually start utilising what I had and start running some stuff. Over the course of a few months I had deployed some hobby projects I'd been working on, as well as some local services like Portainer, and had set up GitHub actions to act as my deployment process. This was done by creating a repo with all of the compose configuration, and creating a GitHub action to `docker compose up -d` on the single compose file I had defined.

This is where the second contention came up. I often found myself test deploying services and leaving the test compose defined on the machine that I'd just shell into. This often led to a drift in what was defined in GitHub and what was actually deployed. Working across many machines was basically made impossible.

For this reason I decided I should seperate my development and deployment environments. Hearing word on proxmox and people using virtualisation in their labs, this sounded like a good starting approach and to just run 2 seperate machines, one with docker running and the other with my Jetbrains gateway host running.

Step 1 to install proxmox, format drives and create a fresh installation. Done. Step 2, boot up and create VMs. Done. Step 3, set up the VMs and get all of the previous services back up and running. Oh, I just formatted the drives. Crap.

This was probably the hardest lesson to learn. I just lost all of the services I had running, and considering most were still half-deployed locally without any sort of backed up configuration I lost most of what I had set up. This doesn't include everything else I had used the computer for previously for personal use, it was all gone.

What a dumb mistake.

From this point on it was clear I needed better rules for myself on keeping backups, and not allowing myself to lose everything in one go. Luckily at least most of the services I cared about were set up months ago and had made their way to the repo, and for personal stuff I was able to put together various backups, uploads etc I had collected over the years so not too much was lost.

I also put a note that anything on the machine could be lost at any time, so if it was important then don't leave just on their. I had also later purchased a NAS to further remove any reliance on the machine.

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
            service-1[Portainer]
            service-2[Jellyfin]
            service-3[Shlink]
            service-n[...]
            service-4[Service-N]

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