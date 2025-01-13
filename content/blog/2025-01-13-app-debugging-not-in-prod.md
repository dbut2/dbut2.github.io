---
title: App debugging not in prod
date: 2024-06-06
draft: false
---
Building a Game Boy Advance emulator has gotten difficult, currently stuck on what appears to be I/O Registers not outputting their correct values and when a game is loaded in the gamepak, the device runs into a boot-loop.

Investigating memory data and it's meaning is difficult, converting binary data to something meaningful, then tracing that to another address if it's a pointer and the cycle repeats. Doing these steps for every CPU cycle to investigate how data is changing is cumbersome and led to the project collecting dust for a few months as I gained the courage to dive into this.

It had been suggested to build a debugger for this, and I think this might be the solution. If I can write a program that wraps the current emulator to watch for memory and other device events that may be relevant, automating the parsing of binary data will speed up the debugging [process.](http://process.In)

[In](http://process.In) building a debugger that holds the emulator, one thing I don't want to do is include this debugging code in the main binary when built, as it is not relevant to the main application, and would waste resources. Hooks and other parsing logic has no need here.

The first thing I'm looking to debug is how memory is changing before/after each CPU cycle. I need a way to hook into the cpu cycle mechanism to read data for each loop. This currently isn't possible in the emulator as I don't allow for hooks or any non-emulator logic from running in any of the functions.

Namely, I want to modify this function to add some hook functions before and after

```go
e.CPU.Step().func (e _Emulator) step() {
	dispstat := ReadIORegister(e.Memory, DISPSTAT)
	HBlank := (1005 - e.CPU.cycles) >> 31 // 0: 0-1005, 1: 1006-1231
	dispstat = SetBits(dispstat, 1, 1, uint16(HBlank))
	SetIORegister(e.Memory, DISPSTAT, dispstat) preCount := e.CPU.cycles
	e.CPU.Step()
	postCount := e.CPU.cycles e.Timer.Tick(postCount - preCount)
}
```

  
Using build tags we can add this functionality. Adding a build tag named build, we can seperate out just the CPU step call into 2 files, 1 in emu\_prod.go, and 1 in emu\_debug.go, with build constraints //go:build !debug for prod, and //go:build debug for debug.We now how 2 more emu files.//go:build !debugpackage gbatype Emulator struct {  
\_Motherboard  
}func (e _Emulator) stepCPU() {  
e.CPU.Step()  
}  
emu\_prod.go//go:build debugpackage gbaimport (  
"_[_github.com/dbut2/sapphire/debugger/hooks"  
)type_](http://github.com/dbut2/sapphire/debugger/hooks%22%EF%BF%BC\)type) \_Emulator struct {\_Motherboard Hooks hooks.HookService\[EmuHook, _Emulator\]  
}type EmuHook intconst (  
PreStepCPUEmuHook EmuHook = iota  
PostStepCPUEmuHook  
)func (e_ Emulator) stepCPU() {  
e.Hooks.Hook(PreStepCPUEmuHook, e)  
e.CPU.Step()  
e.Hooks.Hook(PostStepCPUEmuHook, e)  
}  
emu\_debug.goNow when we build for production, we don't include any build tags, without debug we will build with the prod file, and for debugging we can include the debug tag and the binary will be built with the debug file.