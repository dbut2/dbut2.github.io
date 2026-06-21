---
title: advent of code - Go solutions + framework and library of helpers
weight: 4
draft: false
---
A few years of Advent of Code solutions written in Go, plus a library of helpers and a framework built on proven usage with the goal of minimising time-to-solve.

The first few years started as just pure Go solutions to each day's problem before I realised that creating a library of helpers would be useful in solving some of the reoccurring patterns.
Things like list ordering, filtering, some math functions like min and max (before builtin replaced them), highest common factor, plus many more.

After a few years the library matured and a framework had started to be built around the actual solve function itself.
This framework handles problem fetching, test case analysis and gating for submission, and generic type handling for the input data based on the solve function signature.

With the library, framework, and a base day template built out this allows me to absolutely top my local leaderboard (maybe the global one day).

[Source on GitHub](https://github.com/dbut2/advent-of-code)
