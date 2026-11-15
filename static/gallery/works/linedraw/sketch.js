// Number of pixels wide per cell
var s = 20;

// Number of total moves to be made per frame
var cpf = 40;

// Infinite loop maze
var infinite = false;

function setup() {
	frameRate(100);
	pixelDensity(4);
	createCanvas(windowWidth - windowWidth % s + 1, windowHeight - windowHeight % s + 1);

	initialize();
}

function draw() {

	var cont = true;

	noStroke();
	fill(0, 0, 0);
	rect(0, 0, cols * s + 1, rows * s + 1);

	if (current != undefined) {

		

	} else {
		cont = false;
	}

	for (var i = 0; i < grid.length; i++) {
		show(grid[i]);
	}

	if (!cont == true) {

		link();

		clear();

		noStroke();

		fill(0, 0, 0);
		rect(0, 0, cols * s + 1, rows * s + 1);

		for (var i = 0; i < visited.length; i++) {
			// colorCell(colors.visited, grid[visited[i]]);
		}

		for (var i = 0; i < pairs.length; i++) {
			drawLine(pairs[i], colors.visited);
		}

		for (var i = 0; i < grid.length; i++) {
			show(grid[i]);
		}

		noLoop();

		var solution = findSolution(grid[0], grid[grid.length - 1]);
		drawLine(solution, 0, 127, 0);

	}

}

function initialize() {

	cols = floor((width - 1) / s);
	rows = floor((height - 1) /  s);

	last = 0;

	grid = [];
	visited = [];

	for (var j = 0; j < rows; j++) {
		for (var i = 0; i < cols; i++) {
			var cell = new Cell(i, j);
			grid.push(cell);
		}
	}

	current = [];
	stack = [];

}

function create() {

	initialize();

	loop();

}

function index(i, j) {
	i = floor(i);
	j = floor(j);
	if (infinite) {
		i = ((i % cols) + cols) % cols;
		j = ((j % rows) + rows) % rows;
	}
	if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
		return -1
	} else {
		return i + j * cols;
	}
}

function removeWalls(a, b) {
	var side = neighbourCellSide(a, b);
	if (side === 0) {
		a.walls[0] = false;
		b.walls[2] = false;
	} else if (side === 1) {
		a.walls[1] = false;
		b.walls[3] = false;
	} else if (side === 2) {
		a.walls[2] = false;
		b.walls[0] = false;
	} else if (side === 3) {
		a.walls[3] = false;
		b.walls[1] = false;
	}

	if (side != undefined) {
		pairs.push([a, b]);
	}
}

function checkNeighbours(cell) {

	var neighbours = [];

	i = cell.i;
	j = cell.j;

	var top = grid[index(i, j - 1)];
	var right = grid[index(i + 1, j)];
	var bottom = grid[index(i, j + 1)];
	var left = grid[index(i - 1, j)];

	if (top && !top.visited) {
		neighbours.push(top);
	}

	if (right && !right.visited) {
		neighbours.push(right);
	}

	if (bottom && !bottom.visited) {
		neighbours.push(bottom);
	}

	if (left && !left.visited) {
		neighbours.push(left);
	}

	if (neighbours.length > 0) {
		var r = floor(Math.random() * neighbours.length);
		return neighbours[r];
	} else {
		return undefined;
	}
}

function randomPathNeighbour(cell) {

	var neighbours = [];

	i = cell.i;
	j = cell.j;

	var top = grid[index(i, j - 1)];
	var right = grid[index(i + 1, j)];
	var bottom = grid[index(i, j + 1)];
	var left = grid[index(i - 1, j)];

	if (top && !top.visited && !cell.walls[0] && !top.walls[2]) {
		neighbours.push(top);
	}

	if (right && !right.visited && !cell.walls[1] && !right.walls[3]) {
		neighbours.push(right);
	}

	if (bottom && !bottom.visited && !cell.walls[2] && !bottom.walls[0]) {
		neighbours.push(bottom);
	}

	if (left && !left.visited && !cell.walls[3] && !left.walls[1]) {
		neighbours.push(left);
	}

	if (neighbours.length > 0) {
		var r = floor(Math.random() * neighbours.length);
		return neighbours[r];
	} else {
		return undefined;
	}

}

function show(cell) {

	walls = cell.walls;

	stroke(0, 0, 0);
	strokeWeight(1);

}

function link() {

	var neighbours = [];

	var linked = [0];

	for (var n = 0; n < grid.length; n++) {

		var cell = grid[n];

		i = cell.i;
		j = cell.j;

		var top = grid[index(i, j - 1)];
		var right = grid[index(i + 1, j)];
		var bottom = grid[index(i, j + 1)];
		var left = grid[index(i - 1, j)];

		if (top && top.group !== cell.group) {
			neighbours.push([cell, top]);
		}

		if (right && right.group !== cell.gorup) {
			neighbours.push([cell, right]);
		}

		if (bottom && bottom.group !== cell.group) {
			neighbours.push([cell, bottom]);
		}

		if (left && left.group !== cell.group) {
			neighbours.push([cell, left]);
		}

	}
}

function colorCell(color, cell, border = 0, borderColor = colors.white) {

	if (border) {
		stroke(borderColor[0], borderColor[1], borderColor[2]);
	} else {
		noStroke();
	}

	var edges = cellCorners(cell);

	fill(color[0], color[1], color[2]);
	rect(edges[0] - border, edges[1] - border, s + 1 + border * 2, s + 1 + border * 2);

}

function colorWall(a, b, color) {

	strokeWeight(1);
	stroke(color[0], color[1], color[2]);

	var corners = cellCorners(a);

	if (b >= 0 && b < 4) {
		side = b;
	} else if (b === 4) {
		side = null;
		line(corners[0], corners[1], corners[2], corners[1]);
		line(corners[2], corners[1], corners[2], corners[3]);
		line(corners[2], corners[3], corners[0], corners[3]);
		line(corners[0], corners[3], corners[0], corners[1]);
	} else {
		side = neighbourCellSide(a, b);
	}

	if (side === 0) {
		line(corners[0], corners[1], corners[2], corners[1]);
	} else if (side === 1) {
		line(corners[2], corners[1], corners[2], corners[3]);
	} else if (side === 2) {
		line(corners[2], corners[3], corners[0], corners[3]);
	} else if (side === 3) {
		line(corners[0], corners[3], corners[0], corners[1]);
	}

}

function neighbourCellSide(a, b) {

	if (b == undefined) {
		return null;
	}

	var x = a.i - b.i;
	var y = a.j - b.j;

	if ((y === 1 || y === -rows + 1) && x === 0) {
		return 0;
	} else if ((x === -1 || x === cols - 1) && y === 0) {
		return 1;
	} else if ((y === -1 || y === rows - 1) && x === 0) {
		return 2;
	} else if ((x === 1 || x === -cols + 1) && y === 0) {
		return 3;
	} else {
		return null;
	}
}

function cellCorners(cell) {
	return [cell.i * s, cell.j * s, cell.i * s + s, cell.j * s + s];
}

function findSolution(a, b) {

	stack = [];
	visited = [];

	current = a;

	for (var i = 0; i < grid.length; i++) {
		grid[i].visited = false;
	}

	while (current != b && current !== undefined) {

		current.visited = true;

		if (!visited.includes(index(current.i, current.j))) {
			visited.push(index(current.i, current.j));
		}

		var next = randomPathNeighbour(current);

		if (next != undefined) {

			stack.push(current);
			stack.push(next);
			next.visited = true;

			if (!visited.includes(index(next.i, next.j))) {
				visited.push(index(next.i, next.j));
			}

			current = next;

		} else {

			current = stack.pop();

		}

	}

	return stack;

}

function drawLine(stack, color) {

	var weight = s - 9;
	strokeWeight(weight + 4);
	stroke(color);

	for (var i = 0; i < stack.length - 1; i++) {

		var side = neighbourCellSide(stack[i], stack[i + 1]);
		var coords = [cellCorners(stack[i]), cellCorners(stack[i + 1])];

		if (side === 0) {
			line(coords[0][0] + ceil(s / 2), coords[0][1] + ceil(s / 2), coords[0][0] + ceil(s / 2), coords[0][1]);
			line(coords[1][0] + ceil(s / 2), coords[1][1] + ceil(s / 2), coords[1][0] + ceil(s / 2), coords[1][3]);
		} else if (side === 1) {
			line(coords[0][0] + ceil(s / 2), coords[0][1] + ceil(s / 2), coords[0][2], coords[0][1] + ceil(s / 2));
			line(coords[1][0] + ceil(s / 2), coords[1][1] + ceil(s / 2), coords[1][0], coords[1][1] + ceil(s / 2));
		} else if (side === 2) {
			line(coords[0][0] + ceil(s / 2), coords[0][1] + ceil(s / 2), coords[0][0] + ceil(s / 2), coords[0][3]);
			line(coords[1][0] + ceil(s / 2), coords[1][1] + ceil(s / 2), coords[1][0] + ceil(s / 2), coords[1][1]);
		} else if (side === 3) {
			line(coords[0][0] + ceil(s / 2), coords[0][1] + ceil(s / 2), coords[0][0], coords[0][1] + ceil(s / 2));
			line(coords[1][0] + ceil(s / 2), coords[1][1] + ceil(s / 2), coords[1][2], coords[1][1] + ceil(s / 2));
		}

	}

}

function indexToStack(indexes) {

	stacked = [];

	for (var i = 0; i < indexes.length; i++) {
		stacked.push(grid[indexes[i]]);
	}

	return stacked;

}