---
title: sapphire - GBA emulator written in Go
weight: 1
draft: false
---
A Game Boy Advance emulator written from scratch in Go.

Mostly as a test of my own ability to understand the inner workings of computers generally and improve my understanding of low level systems, machine code, and _how_ code runs beyond clicking a play button.

This project emulates the ARM7TDMI processor in the console for both the ARM and THUMB instruction sets, plus all the memory mappings, memory transfer buffers, timing controls, and registers.
Full display output for all the specified display modes for sprites, backgrounds, or direct writes.

[Play it in the browser](/blog/sapphire/) | [Source on GitHub](https://github.com/dbut2/sapphire)
