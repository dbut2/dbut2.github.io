---
title: coach - AI running coach
weight: 2
draft: false
---
An AI running coach you text every day.

It connects to Strava (with optional Garmin wellness data), watches training as it syncs, builds and adapts a plan around a race goal, and remembers what matters across days. One chat thread, and a coach that happens to see all my data rather than another dashboard.

The design constraint I cared most about: the model never computes a number. All the quantitative work — training load, acute:chronic ratios, pace and heart-rate zones, plan constraints — is deterministic Go exposed to the agent as tools, so it's unit-testable and can't drift. The agent decides what to call; the core does the maths.

Like float, the code is AI-written and the product is mine: the architecture, the data model, and a decision log where every choice was reasoned through before any production code existed.

[Source on GitHub](https://github.com/dbut2/coach)
