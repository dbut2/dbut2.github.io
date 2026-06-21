---
title: commuter - Strava activity automation
weight: 2
draft: false
---
Strava Automation.

A rules engine with custom data sources to allow automatic updates to Strava activities in realtime without needing to manually manage activities.

Built out of a single rule to mark my cycles to and from work as a "commute" and hide it from the home feed at to not spam my friends feeds.

This was eventually extended to support "Challenges" that could update my friends on a multi-day challenge via the activity description, eg:
```text
100 Mile Challenge: Day {.Day}/10
Distance: {.Distance}/160.9km
Total Time: {.Duration}
```

With another case of wanting to automatically add my parkrun event location to my activity title, I built out a more generic engine that can update any field on an activity based on some rules from the activity.
Rules can be based on activity type, location, distance, or any field that Strava returns from their API.

[Source on GitHub](https://github.com/dbut2/commuter)
