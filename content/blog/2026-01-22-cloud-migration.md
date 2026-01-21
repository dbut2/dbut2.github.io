---
title: Cloud Migration
date: 2026-01-22
draft: false
---
Monorepo pros:

*   Single management
    
*   Global dependancy updates
    
*   Changes are easier to make cross project (ie making a change on a project and it's dependancy in the same branch)
    

Monorepo cons:

*   Branches cover all projects, can't change context without stashing (this can be solved with worktrees but is tedious)
    
*   Remotes become out of sync when making changes in remote
    
*   Requires custom tooling for syncs