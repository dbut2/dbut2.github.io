---
title: Programmatic Minesweeper Solving
date: 2026-01-06
draft: false
---
I've been working through puzzles on [puzzle-minesweeper.com](https://www.puzzle-minesweeper.com) for fun lately. The approach I landed on works for the "easy" difficulty puzzles, which are specifically designed to be solvable using just two basic constraint propagation rules - rules that use constraints to deduce new information. Real minesweeper games and harder difficulties require more complex deduction patterns, but for these puzzles, the simple rules are sufficient.

The core challenge is taking a compact representation of a puzzle state and using constraint propagation to determine which cells are bombs and which are safe.

## Encoding the puzzle

The puzzle data is embedded in the page HTML as a compact string, which the solver extracts and parses into an internal grid representation. Letters encode runs of unknown cells (a=1, b=2, c=3, etc.), numbers represent revealed cells showing adjacent bomb counts.

Input string:

```
b1c211a1a2a1c31a3b1
```

Parsed character-by-character (unknowns are shown as `_`):

```
b → _ _
1 → 1
c → _ _ _
2 → 2
1 → 1
1 → 1
a → _
...
```

This produces a sequence of 25 cells:

```
_ _ 1 _ _ _ 2 1 1 _ 1 _ 2 _ 1 _ _ _ 3 1 _ 3 _ _ 1
```

Since there are 25 cells, the grid must be 5×5. The cells are then arranged into a grid:

```
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 _ 1
_ _ _ 3 1
_ 3 _ _ 1
```

## The solving logic

The solver uses two basic rules that are repeatedly applied until the puzzle is solved.

### Rule 1: Mark remaining unknowns as bombs

Consider the bottom-right `1` cell. Looking at its neighbours:

```
      3 1
      _ 1 <- this 1 has only one unknown neighbour
```

The `1` cell needs exactly 1 bomb adjacent to it. It only has one unknown neighbour. Therefore that unknown must be a bomb (`y`):

```
      3 1
      y 1 <- unknown must be a bomb
```

Applied to the full grid:

```
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 _ 1
_ _ _ 3 1
_ 3 _ y 1 <- marked as bomb
```

### Rule 2: Mark remaining unknowns as safe

Now look at the middle-right `1` cell and its neighbours:

```
    _ 1 <- unknown above
    3 1 <- this 1 already has one bomb below-left
    y 1 <- bomb we just marked
```

The middle `1` already has 1 bomb adjacent to it (the `y` below-left). Since it only needs 1 bomb total, the unknown cell above must not be a bomb (`n`):

```
    n 1 <- must be safe
    3 1
    y 1
```

Applied to the full grid:

```
_ _ 1 _ _
_ 2 1 1 _
1 _ 2 n 1 <- marked as safe
_ _ _ 3 1
_ 3 _ y 1
```

### Iterating to completion

Applying these two rules repeatedly, checking each numbered cell against its neighbours, eventually determines every cell:

```
y y 1 n n
n 2 1 1 y
1 n 2 n 1
n y y 3 1
n 3 y y 1
```

Where `y` represents bombs and `n` represents safe cells.

## Implementation

The solver initializes a queue with all numbered cells in the grid, then processes them one by one. For each cell popped from the queue, we skip non-numbered cells and count adjacent bombs and unknowns:

```go
var bombs, unknowns int
var unknownCells [][2]int
for _, nextCell := range grid.Surrounding(cell) {
    switch grid.Get(nextCell) {
    case unknown:
        unknowns++
        unknownCells = append(unknownCells, nextCell)
    case bomb:
        bombs++
    }
}

// Rule 1: mark remaining unknowns as bombs
if unknowns + bombs == cellValue {
    for _, unknownCell := range unknownCells {
        // mark all unknown neighbours as bombs
        grid.Set(unknownCell, bomb)
        // add their neighbours to queue for re-evaluation
        queue.Push(grid.Surrounding(unknownCell)...)
    }
}

// Rule 2: mark remaining unknowns as safe
if bombs == cellValue {
    for _, unknownCell := range unknownCells {
        // mark all unknown neighbours as safe
        grid.Set(unknownCell, safe)
        // add their neighbours to queue for re-evaluation
        queue.Push(grid.Surrounding(unknownCell)...)
    }
}
```

When a cell is marked as a bomb or safe, its neighbors are added back to the queue for re-evaluation. The solver continues processing cells from the queue until it becomes empty, meaning no more deductions can be made.

## Output format

Once solved, the full grid is read left-to-right, top-to-bottom to produce an output string that's submitted back to the puzzle website. Numbered cells map to `n` since they are not bombs themselves:

```
y y 1 n n      y y n n n
n 2 1 1 y      n n n n y
1 n 2 n 1  ->  n n n n n
n y y 3 1      n y y n n
n 3 y y 1      n n y y n
```

Producing the final output:

```
yynnnnnnnynnnnnnyynnnnyyn
```

The key insight is that minesweeper is just constraint satisfaction. Each numbered cell tells you exactly how many bombs must be adjacent, and by checking if that constraint is already satisfied or must be fully satisfied by remaining unknowns, you can iteratively solve the puzzle without guessing.

These two rules handle all the easy difficulty puzzles, but more complex minesweeper games require additional deduction patterns. When multiple cells share overlapping unknowns, you need to consider the constraints together rather than individually. For now, this solver does what I need it to.