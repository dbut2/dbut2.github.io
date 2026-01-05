---
title: Programmatic Minesweeper Solving
date: 2026-01-06
draft: false
---
I've been working on a programmatic solver for minesweeper puzzles, and wanted to document the approach I landed on. The core challenge is taking a compact representation of a puzzle state and using constraint propagation to determine which cells are bombs and which are safe.

## Encoding the puzzle

The solver takes a compact string format and expands it into a 5×5 grid. Letters represent unknown cells, numbers represent revealed cells showing adjacent bomb counts.

Starting with the compact format:

```
b1c211a1a2a1c31a3b1
```

First, expand with spaces:

```
b 1 c 2 1 1 a 1 a 2 a 1 c 3 1 a 3 b 1
```

Convert letters to underscores (unknowns):

```
_ 1 _ 2 1 1 _ 1 _ 2 _ 1 _ 3 1 _ 3 _ 1
```

Finally, arrange into a 5×5 grid:

```
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 _ 1
_ _ _ 3 1
_ 3 _ _ 1
```

## The solving logic

The solver uses two basic constraint propagation rules repeatedly until the puzzle is solved.

### Rule 1: All unknowns must be bombs

Consider the bottom-right `1` cell. Looking at its neighbors:

```
    3 1
    _ 1  ← this 1 has only one unknown neighbor
```

The `1` cell needs exactly 1 bomb adjacent to it. It only has one unknown neighbor. Therefore that unknown must be a bomb (`Y`):

```
    3 1
    Y 1  ← unknown must be a bomb
```

Applied to the full grid:

```
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 _ 1
_ _ _ 3 1
_ 3 _ Y 1  ← marked as bomb
```

### Rule 2: All unknowns must be safe

Now look at the middle-right `1` cell and its neighbors:

```
    _ 1  ← unknown above
    3 1  ← this 1 already has one bomb below
    Y 1  ← bomb we just marked
```

The middle `1` already has 1 bomb adjacent to it (the `Y` below). Since it only needs 1 bomb total, the unknown cell above must not be a bomb (`N`):

```
    N 1  ← must be safe
    3 1
    Y 1
```

Applied to the full grid:

```
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 N 1  ← marked as safe
_ _ _ 3 1
_ 3 _ Y 1
```

### Iterating to completion

Applying these two rules repeatedly, checking each numbered cell against its neighbors, eventually determines every cell:

```
Y Y 1 N N
N 2 1 1 Y
1 N 2 N 1
N Y Y 3 1
N 3 Y Y 1
```

Where `Y` represents bombs and `N` represents safe cells.

## Implementation

The constraint checking logic translates directly to code. For each numbered cell, count adjacent flags and unknowns, then apply the rules:

```go
var flags, unknowns int
var unknownCells [][2]int
for nextCell, nextValue := range grid.Surrounding(cell) {
    switch *nextValue {
    case unknown:
        unknowns++
        unknownCells = append(unknownCells, nextCell)
    case flag:
        flags++
    }
}

// Rule 1: all unknowns must be bombs
if unknowns + flags == cellValue {
    for unknownCell := range unknownCells {
        // mark all unknown neighbours as flags
        grid.Set(unknownCell, flag)
        // add their neighbours to queue for re-evaluation
        queue.Push(grid.Surrounding(unknownCell)...)
    }
}

// Rule 2: all unknowns must be safe
if flags == cellValue {
    for unknownCell := range unknownCells {
        // mark all unknown neighbours as empty
        grid.Set(unknownCell, empty)
        // add their neighbours to queue for re-evaluation
        queue.Push(grid.Surrounding(unknownCell)...)
    }
}
```

The solver processes cells from a queue, applying these rules until no more deductions can be made.

## Output format

Once solved, the result is converted back to compact form. First extract just the bomb/safe values (removing the numbered cells):

```
Y Y N N N
N N N N Y
N N N N N
N Y Y N N
N N Y Y N
```

Flatten to a single line:

```
Y Y N N N N N N N Y N N N N N N Y Y N N N N Y Y N
```

Convert to lowercase for the final compact string:

```
yynnnnnnnynnnnnnyynnnnyyn
```

The key insight is that minesweeper is just constraint satisfaction. Each numbered cell tells you exactly how many bombs must be adjacent, and by checking if that constraint is already satisfied or must be fully satisfied by remaining unknowns, you can iteratively solve the puzzle without guessing.