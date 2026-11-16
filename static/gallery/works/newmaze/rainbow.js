var defaults = {
	width: 800,
	height: 600,
	cols: 0,
	rows: 0,
	loop: 0,
	iterations: 1
}

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
		context.beginPath();
		context.moveTo(x, y);
		context.lineTo(x2, y2);
		context.stroke();
	};
	this.stroke = function(style) {
		context.strokeStyle = style;
	};
}

function createMaze(iterations) {

	changes = [];

	for (var count = 0; count < iterations; count++) {

		var current = stack[stack.length - 1];

		if (current == undefined) {
			stop();
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
		screen.fill(fill);
		screen.fillRect(cell.i, cell.j, 1, 1);
	}
}

function drawScreen() {

	for (var i = 0; i < changes.length; i++) {
		drawCell(changes[i], 'hsl(' + 7200 * longstack.length / grid.length + ', 100%, 50%)');
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
	defaults.loop = setInterval(draw, 1);
}

function getIndex(i, j) {
	if (i >= defaults.cols || i < 0 || j >= defaults.rows || j < 0) {
		return -1
	} else {
		var index = j * defaults.cols + i;
		return index;
	}
}

function setup() {

	canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
	screen = new Screen();

	defaults.width = window.innerWidth;
	defaults.height = window.innerHeight;

	canvas.width = defaults.width;
	canvas.height = defaults.height;

	defaults.cols = defaults.width;
	defaults.rows = defaults.height;

	context.translate(0, 0);

	grid = [];

	for (var j = 0; j < defaults.rows; j++) {
		for (var i = 0; i < defaults.cols; i++) {
			var cell = new Cell(i, j);
			grid.push(cell);
		}
	}

	stack[0] = grid[Math.floor(Math.random() * grid.length)];

	longstack = [];
	changes = [];

	loop();

}

function stop() {
	clearInterval(defaults.loop);
}

window.onload = function(){setup()};