---
title: Adding GPUs to Docker Swarm and Running GPU-Enabled Services
date: 2024-09-26
draft: false
tags:
  - self-hosted
---
## Introduction

This guide will walk you through the process of attaching GPUs to a Docker Swarm node and running services that can utilize these GPUs. This setup is particularly useful for running GPU-intensive workloads in a distributed environment.

## Assumptions

*   You are running a recent version of Ubuntu (Noble 24.04 LTS in this case).
*   You have NVIDIA drivers already installed (preferably the `-server` version).
    *   If not, follow the instructions at [Ubuntu's NVIDIA driver installation guide](https://ubuntu.com/server/docs/nvidia-drivers-installation).
*   You have Docker and Docker Swarm already set up on your system.

## Steps to Add GPUs to Docker Swarm

### 1\. Identify Your GPU

First, we need to find the UUID of the GPU you want to attach to Docker Swarm.

Run the following command:

```shell
nvidia-smi -a
```

Look for the `GPU UUID` line under the desired GPU. In this example, we're using an RTX 3060:

```shell
==============NVSMI LOG==============

Driver Version                            : 535.183.01
CUDA Version                              : 12.2

Attached GPUs                             : 1
GPU 00000000:00:10.0
    Product Name                          : NVIDIA GeForce RTX 3060
...
    GPU UUID                              : GPU-a0df8e5a-e4b9-467d-9bf5-cebb65027549
...
```

### 2\. Update Docker Daemon Configuration

Edit the Docker daemon configuration file:

```shell
sudo nano /etc/docker/daemon.json
```

Add or modify the following content:

```json
{
  "runtimes": {
    "nvidia": {
      "args": [],
      "path": "/usr/bin/nvidia-container-runtime"
    }
  },
  "default-runtime": "nvidia",
  "node-generic-resources": [
    "NVIDIA-GPU=GPU-a0df8e5a-e4b9-467d-9bf5-cebb65027549"
  ]
}
```

Replace the UUID in `node-generic-resources` with the one you found in step 1.

### 3\. Configure NVIDIA Container Runtime

Edit the NVIDIA container runtime configuration:

```shell
sudo nano /etc/nvidia-container-runtime/config.toml
```

Find the `swarm-resource` line and uncomment it. Replace its content with:

```toml
swarm-resource = "DOCKER_RESOURCE_NVIDIA-GPU"
```

### 4\. Restart Docker Service

After making these changes, restart the Docker service:

```shell
sudo systemctl restart docker
```

## Running GPU-Enabled Services on Docker Swarm

Now that we've attached the GPU to our Docker Swarm node, we can run services that utilize this GPU. Here's how to deploy a GPU-enabled service using Docker Compose:

Create a compose.yaml file with the following content:

```yaml
services:
  gpu-service:
    image: ubuntu
    command: nvidia-smi
    deploy:
      placement:
        constraints:
          - node.labels.gpu == true
      resources:
        reservations:
          generic_resources:
            - discrete_resource_spec:
                kind: 'NVIDIA-GPU'
                value: 0
```

This compose service does the following:

*   Creates a service named gpu-service
*   Constrains the service to run only on nodes with the gpu label set to true
*   Reserves one GPU resource for this service
*   Mounts the NVIDIA container runtime hook
*   Uses your GPU-enabled Docker image

## Conclusion

By following these steps, you've successfully added GPU support to your Docker Swarm node and learned how to deploy GPU-enabled services. This setup allows you to leverage the power of GPUs in your distributed Docker environment, enabling more efficient processing for tasks like machine learning, scientific computing, and video processing.