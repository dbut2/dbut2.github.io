function Cell(i, j) {
	this.i = i;
	this.j = j;
	this.group = -1;
	this.visited = false;
	this.walls = [true, true, true, true];
}