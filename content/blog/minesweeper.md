---
title: Programmatic Minesweeper Solving
date: 2026-01-06
draft: false
---

I've been working on a programmatic solver for minesweeper puzzles, and wanted to document the approach I landed on. The core challenge is taking a compact representation of a puzzle state and using constraint propagation to determine which cells are bombs and which are safe.

## Encoding the puzzle

The solver takes a compact string format and expands it into a 5×5 grid. Letters represent unknown cells, numbers represent revealed cells showing adjacent bomb counts.

Starting with:
```
b1c211a1a2a1c31a3b1
```

This expands with spaces:
```
[ b 1 c 2 1 1 a 1 a 2 a 1 c 3 1 a 3 b 1 ]
```

Then letters become underscores for unknowns:
```
[ _ _ 1 _ _ _ 2 1 1 _ 1 _ 2 _ 1 _ _ _ 3 1 _ 3 _ _ 1 ]
```

And finally arranged into a grid:
```
[
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 _ 1
_ _ _ 3 1
_ 3 _ _ 1
]
```

## The solving logic

The solver uses two basic constraint propagation rules repeatedly until the puzzle is solved.

### Rule 1: All unknowns must be bombs

Consider this section from the bottom-right:
```
[
3 1
_ 1
]
```

The `1` cell needs exactly 1 bomb adjacent to it. It only has one unknown neighbor. Therefore that unknown must be a bomb (`Y`):
```
[
3 1
Y 1
]
```

Applied to our grid:
```
[
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 _ 1
_ _ _ 3 1
_ 3 _ Y 1
]
```

### Rule 2: All unknowns must be safe

Now look at this section from the middle-right:
```
[
_ 1
3 1
Y 1
]
```

The middle `1` already has 1 bomb adjacent to it (the `Y` below). Since it only needs 1 bomb total, the unknown cell above must not be a bomb (`N`):
```
[
N 1
3 1
Y 1
]
```

Applied to our grid:
```
[
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 N 1
_ _ _ 3 1
_ 3 _ Y 1
]
```

### Iterating to completion

Applying these two rules repeatedly, checking each numbered cell against its neighbors, eventually determines every cell:
```
[
Y Y 1 N N
N 2 1 1 Y
1 N 2 N 1
N Y Y 3 1
N 3 Y Y 1
]
```

## Output format

Once solved, the result is converted back to compact form. First extract just the bomb/safe values:
```
[
Y Y N N N
N N N N Y
N N N N N
N Y Y N N
N N Y Y N
]
```

Then to array format:
```
[ Y Y N N N N N N N Y N N N N N N Y Y N N N N Y Y N ]
```

And finally to the compact string:
```
yynnnnnnnynnnnnnyynnnnyyn
```

The key insight is that minesweeper is just constraint satisfaction. Each numbered cell tells you exactly how many bombs must be adjacent, and by checking if that constraint is already satisfied or must be fully satisfied by remaining unknowns, you can iteratively solve the puzzle without guessing.
