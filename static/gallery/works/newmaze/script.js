var options = {
	iterations: 100,
	cellSize: 10,
	frameRate: 1000,
	quickDraw: 1
}

var defaults = {
	cellSize: 75,
	width: 800,
	height: 600,
	frameRate: 30,
	cols: 0,
	rows: 0,
	loop: 0,
	iterations: 1,
	quickDraw: 0
}

var actions = [draw, play];

var action = 'draw';

var grid = [];
var stack = [];
var longstack = [];
var changes = [];

var canvas;
var context;
var screen;

function Cell(i, j) {
	this.i = i;
	this.j = j;
	this.v = 0;
	this.w = [1, 1, 1, 1];
}

function Screen() {
	this.clear = function() {
		context.clearRect(0, 0, defaults.width, defaults.height);
	};
	this.fill = function(style) {
		context.fillStyle = style;
	};
	this.fillRect = function(x, y, width, height) {
		context.fillRect(x, y, width, height);
	};
	this.line = function(x, y, x2, y2) {
		context.translate(0.5, 0.5);
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x2, y2);
		context.stroke();
		context.translate(-0.5, -0.5);
	};
	this.stroke = function(style) {
		context.strokeStyle = style;
	};
}

function clearCell(cell) {
	if (cell != undefined) {
		screen.fill('#FFFFFF');
		screen.fillRect(defaults.cellSize * cell.i, defaults.cellSize * cell.j, defaults.cellSize, defaults.cellSize);
	}
}

function createMaze(iterations) {

	changes = [];

	for (var count = 0; count < iterations; count++) {

		var current = stack[stack.length - 1];

		if (current == undefined) {
			nextAction();
		} else {
			changes.push(current);
			current.v = 1;
			var next = findNeighbor(current);

			if (next == undefined) {
				stack.pop();
			} else {
				stack.push(next);
				longstack.push(next);
				next.v = true;

				removeWalls(current, next);
			}
		}
	}

}

function draw() {

	createMaze(defaults.iterations);
	drawScreen();
	
}

function drawCell(cell, fill) {
	if (cell != undefined) {
		fill = fill || '#FFFFFF';
		var x = defaults.cellSize * cell.i;
		var y = defaults.cellSize * cell.j;
		var x2 = x + defaults.cellSize;
		var y2 = y + defaults.cellSize;
		screen.fill(fill);
		screen.fillRect(x, y, defaults.cellSize + 1, defaults.cellSize + 1);
		screen.stroke('#000000');
		if (cell.w[0]) {
			screen.line(x, y, x2, y);
		}
		if (cell.w[1]) {
			screen.line(x2, y, x2, y2);
		}
		if (cell.w[2]) {
			screen.line(x2, y2, x, y2);
		}
		if (cell.w[3]) {
			screen.line(x, y2, x, y);
		}
	}
}

function drawLine(cell1, cell2, style) {

	if (cell2 != undefined) {

		style = style || '#FFFFFF';

		screen.stroke(style);

		var offset = Math.floor(defaults.cellSize / 2);

		x = cell1.i * defaults.cellSize + offset;
		y = cell1.j * defaults.cellSize + offset;
		x2 = cell2.i * defaults.cellSize + offset;
		y2 = cell2.j * defaults.cellSize + offset;

		screen.line(x, y, x2, y2);

	}

}

function drawScreen() {

	if (defaults.quickDraw) {

		for (var i = 0; i < changes.length; i++) {
			clearCell(changes[i]);
			// drawCell(changes[i], 'hsl(' + 7200 * longstack.length / grid.length + ', 100%, 50%)');
			drawCell(changes[i], '#FFFFFF');
		}

	} else {

		screen.clear();

		for (var i = 0; i < grid.length; i++) {
			if (grid[i].v) {
				drawCell(grid[i], '#FFFFFF');
			} else {
				drawCell(grid[i], '#000000');
			}
		}

		for (var i = 0; i < stack.length; i++) {
			drawCell(stack[i], '#7F7F7F');
			drawLine(stack[i], stack[i-1]);
		}

	}

}

function findNeighbor(cell) {

	var neighbors = [];

	var t = grid[getIndex(cell.i, cell.j - 1)];
	var right = grid[getIndex(cell.i + 1, cell.j)];
	var bottom = grid[getIndex(cell.i, cell.j + 1)];
	var left = grid[getIndex(cell.i - 1, cell.j)];

	if (t && !t.v) {
		neighbors.push(t);
	}
	if (right && !right.v) {
		neighbors.push(right);
	}
	if (bottom && !bottom.v) {
		neighbors.push(bottom);
	}
	if (left && !left.v) {
		neighbors.push(left);
	}

	if (neighbors.length > 0) {
		var r = Math.floor(Math.random() * neighbors.length);
		return neighbors[r];
	} else {
		return undefined;
	}

}

function loop() {
	defaults.loop = setInterval(update, 1000 / defaults.frameRate);
}

function getIndex(i, j) {
	if (i >= defaults.cols || i < 0 || j >= defaults.rows || j < 0) {
		return -1
	} else {
		var index = j * defaults.cols + i;
		return index;
	}
}

function removeWalls(cell1, cell2) {

	var i = cell2.i - cell1.i;
	var j = cell2.j - cell1.j;

	if (j == -1) {
		cell1.w[0] = 0;
		cell2.w[2] = 0;
	}
	if (i == 1) {
		cell1.w[1] = 0;
		cell2.w[3] = 0;
	}
	if (j == 1) {
		cell1.w[2] = 0;
		cell2.w[0] = 0;
	}
	if (i == -1) {
		cell1.w[3] = 0;
		cell2.w[1] = 0;
	}

}

function setup() {

	for (var option in options) {
		defaults[option] = options[option];
	}

	canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
	screen = new Screen();

	defaults.width = window.innerWidth - (window.innerWidth - 1) % defaults.cellSize;
	defaults.height = window.innerHeight - (window.innerHeight - 1) % defaults.cellSize;

	canvas.width = defaults.width + 1;
	canvas.height = defaults.height + 1;

	defaults.cols = (defaults.width - 1) / defaults.cellSize;
	defaults.rows = (defaults.height - 1) / defaults.cellSize;

	for (var j = 0; j < defaults.rows; j++) {
		for (var i = 0; i < defaults.cols; i++) {
			var cell = new Cell(i, j);
			grid.push(cell);
		}
	}

	stack[0] = grid[Math.floor(Math.random() * grid.length)];

	loop();

}

function stop() {
	clearInterval(defaults.loop);
}

function update() {
	action;
}

window.onload = function(){setup()};