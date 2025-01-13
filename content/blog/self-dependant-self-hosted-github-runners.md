---
title: Self-Dependant, Self-Hosted GitHub Runners
date: 2024-06-05
draft: false
---

On the journey of self hosting, one thing I want to get automated and running locally was my deployments. Having all of my services defined as Docker Compose services would be ideal. Wanting to keep this configuration held in GitHub, alongside my other code, this raises the next question, how do I propagate these changes to my local machine and redeploy my services?

My initial thoughts were to try to find a CI/CD platform that was able to be ran as a self-hosted setup, and also support Docker deployments, specifically supporting Compose as I wanted to keep my configs simple and familiar.

This search turned up mostly empty, with the only decent results requiring a manual step in each deployment config to just run a Docker-in-Docker container that would then run Compose. This felt redundant and the use of fully featured would be going to waste, using resources on the machine that it didn't require.

As these platforms would required Compose commands to be ran directly anyway, the next solution was to use GitHub self-hosted runners running locally. This felt like an okay solution, the only caveat being that self-hosted runners can only run within Organisations or Enterprises. The would require me to setup another entity to store my self-hosted setup, and to create the runners.

All of the configuration for my services already sat within private repos, so having a separation between this and my personal projects, and migrating these over to an Organisation was a move I was fine with.

Once the org was created and the configs were moved across, the next step was to get the runners up and going.

Ideally I wanted the runners to run inside Docker containers, keeping with the rest of my services. This had some difficulty as GitHub only really officially supports a direct install and execution, but after some searching I had found a reputable image that had already been created, myoung34/github-runner. This was easy enough to get configured and running.

```yaml
services:
  github-runner:
    image: myoung34/github-runner:ubuntu-noble
    environment:
      ACCESS_TOKEN: ${ACCESS_TOKEN}
      ORG_NAME: dbutlabs
      RUNNER_SCOPE: org
      LABELS: self-hosted,docker
```

Now I had the service config defined for the runners, I needed to get this automated so that when placed in the repo, and had changes made, the runners would redeploy and update to their new state.

This seemed like it would be a fairly easy GitHub workflows setup.

```yaml
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: [self-hosted]
    steps:
      - uses: actions/checkout@v4
      - run: |
          docker compose up --detach
```

I committed this new workflow to the repo and pushed. The runner I had manually created during local testing above picked up the job fine and ran the deployment for the new runners. I then removed the old runner, and left the way for the automated runners to control. All was fine.

Rerunning the workflow run for good measure, I wanted to make sure the runners were able to redeploy themselves now they were taking in all jobs for the org. I run the job, the runner picks this up and starts to run no issues.

Then I get the following errors:

```
deploy: The runner has received a shutdown signal. This can happen when the runner service is stopped, or a manually started runner is canceled.
deploy: The operation was canceled.
```

What happened? When the workflow was execute and `docker compose up` was ran, this shut downs the current runner containers, ready for the new containers to start up. The issue? This also cancels the compose up command before it finishes executing, and critically, before it attempts to start the new containers.

Now the runners have been shut down, and no new runners have been started, this means I'm left with no runners. This is a problem.

It looks like we cannot run this workflow on the runners themselves, else they we always be shut down as a result.

My first solution was to create a new set of runners that would only be ran for the purpose of managing my primary runners. This felt cumbersome as they would not only waste resources for the majority of the time, updating runners would likely be an infrequent task, and then the questions raises, what manages these runners? Another set of runners?

Thinking through the problem somewhat, and realising whatever the solution the end result would be this workflow would have to run in another container, outside of the runner. The came to the solution of updating the current workflow to rather than run docker compose directly, we can run a docker Docker container, or Docker-in-Docker container, that would run compose. This would allow the runners to be shut down during deployment without affecting running job as it wouldn't need to be shutdown, so long as it's a detached container.

```yaml
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: [self-hosted]
    steps:
      - uses: actions/checkout@v4
      - run: |
          docker run -d --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            -v /tmp/runner/$(pwd):/workspace \
            -w /workspace \
            docker compose up --build
```

Now I restart the runners manually, run this job, run this job again. All working fine now. The runners aren't shutting themselves down, and the docker container is being executed successfully and deploying the runners.

The only minor difficulty being that as we checkout the repo on the runner itself, but this job runs inside a seperate container, we need to now mount a volume to both the runners and this job so they can share these files. This works fine bit is a little less than ideal.

There is one lingering issue where this docker container can execute and shut down the runners before the GitHub workflow has a chance to complete, and results in GitHub marking the workflow run as failed despite the action of the workflow, the docker run, working fine. This isn't really an issue as docker compose still completes successfully but is annoying to look at a red cross when you know everything's ok. But that's an issue for another day.
