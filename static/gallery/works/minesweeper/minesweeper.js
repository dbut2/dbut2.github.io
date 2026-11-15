var ms = {

	width: 0,
	height: 0,
	boxes: 0,
	bombs: 0,
	score: 0,
	board: [],

	create: function (width, height) {

		this.width = width;
		this.height = height;
		this.boxes = width * height;
		this.score = width * height;

		var board = '<table>';
		for (var i = 1; i <= height; i++) {
			board += '<tr>';
			for (var j = 1; j <= width; j++) {
				board += '<td id="' + j + ',' + i + '" onClick="ms.click(' + j + ', ' + i + ')"></td>';
			}
			board += '</tr>';
		}
		for (var i = 0; i <= width + 1; i++) {
			this.board[i] = [];
			for (var j = 0; j <= height + 1; j++) {
				this.board[i][j] = 0;
			}
		}
		board += '</table>';
		$('#gameBoard').html(board);

	},

	generate: function (bombs) {

		this.create(this.width, this.height);

		this.bombs = bombs;

		if (bombs > this.boxes) {
			bombs = this.boxes;
		}

		for (i = 0; i < bombs; i++) {
			do {
				ranCol = Math.ceil(Math.random() * this.width);
				ranRow = Math.ceil(Math.random() * this.height);
			} while (this.board[ranCol][ranRow] == 'bomb');

			this.board[ranCol - 1][ranRow - 1]++;
			this.board[ranCol - 1][ranRow]++;
			this.board[ranCol - 1][ranRow + 1]++;
			this.board[ranCol][ranRow - 1]++;
			this.board[ranCol][ranRow] = 'bomb';
			this.board[ranCol][ranRow + 1]++;
			this.board[ranCol + 1][ranRow - 1]++;
			this.board[ranCol + 1][ranRow]++;
			this.board[ranCol + 1][ranRow + 1]++;
		}
	},

	click: function (col, row) {

		if (this.board[col][row] === 'bomb') {
			this.gameEnd();
		} else {
			if (this.board[col][row] == 0) {
				showCurrent = [];
				this.showEmpty(col, row);
			}
			document.getElementById(col + ',' + row).innerHTML = this.board[col][row];
		}

	},

	showEmpty: function (col, row) {

		if (col > 0 && col <= this.width && row > 0 && row <= this.height) {
			if (document.getElementById(col + ',' + row).innerHTML == '') {
				document.getElementById(col + ',' + row).innerHTML = this.board[col][row];
				if (this.board[col][row] === 0) {
					for (var i = -1; i <= 1; i++) {
						for (var j = -1; j <= 1; j++) {
							this.showEmpty(col + i, row + j);
							this.score--;
						}
					}
				} else if (this.board[col][row] === 1) {
					$('#' + col + ',' + row).addClass('one');
				} else if (this.board[col][row] === 2) {
					$('#' + col + ',' + row).addClass('two');
				} else if (this.board[col][row] === 3) {
					$('#' + col + ',' + row).addClass('three');
				}
			}
		}

	},

	gameEnd: function () {

		$('#gameBoard').html('Sorry you have lost. The game will restart in 10 seconds.');
		setTimeout(function(){ms.create(ms.width, ms.height);ms.generate(ms.bombs);}, 10000);

	}

}



// addClass();
// removeClass();