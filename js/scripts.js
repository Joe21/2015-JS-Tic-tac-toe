// On document ready, instantiate globalContainer
$(document).ready(function() {
	var currentGame;
	globalContainer();
});

// ==========================================================================
// MASTER CONTROLLER aka globalContainer
// ==========================================================================
// Constructor for global container
// 	- This design allows for persistent scorekeeping with newer games
// 	- Deters javascript hacking to manipulate the score

function globalContainer() {
	var gameMode = null;
	var globalPlayer1 = new player(1);
	var globalPlayer2 = new player(2);

	// event driven gameMenu with callbacks to handle initializers
	gameMenu(gameMode, globalPlayer1, globalPlayer2);

	// ==========================================================================
	// GLOBAL CONTAINER OBJECTS
	// ==========================================================================

	// Constructor function to prototype player object
	function player(id) {
		self.id = id,
		self.name = "",
		self.wins = 0,
		self.losses = 0,
		self.draws = 0,
		self.avatar = ""
	}

	// ==========================================================================
	// INITIALIZE SETTINGS
	// ==========================================================================

	function gameMenu(gameMode, globalPlayer1, globalPlayer2) {
		$('#pve-button').click(function() {
			gameMode = 'pve';
			
			// initialize scoreboard, set player names
			initializeScoreboard(gameMode, globalPlayer1, globalPlayer2);

			// Closes overlay
			toggleWrapper();

			// Start game initializer
			initiateGameType(gameMode, globalPlayer1, globalPlayer2);
		})

		$('#pvp-button').click(function() {
			gameMode = 'pvp';

			// initialize scoreboard, set player names
			initializeScoreboard(gameMode, globalPlayer1, globalPlayer2);

			// Closes overlay
			toggleWrapper();

			// Start game initializer
			initiateGameType(gameMode, globalPlayer1, globalPlayer2);
		})
	}

	function initializeScoreboard(gameMode, globalPlayer1, globalPlayer2) {
		// initialize for 1 player vs AI
		if(gameMode == 'pve') {
			globalPlayer1.name = prompt('Please enter name for player 1');
			$('#player1-name').text(globalPlayer1.name);
			
			var namesArray = ['Evil Robot', 'T-1000', 'Cylon', 'Megatron', 'SkyNet'];
			globalPlayer2.name = namesArray[Math.floor(Math.random()*namesArray.length)];
			$('#player2-name').text(globalPlayer2.name);

		} else {
		// initialize for 2 players head to head
			globalPlayer1.name = prompt('Please enter name for player 1');
			$('#player1-name').text(globalPlayer1.name);

			globalPlayer2.name = prompt('Please enter name for player 2');
			$('#player2-name').text(globalPlayer2.name);
		}
	}

	// Close overlay and render wrapper
	function toggleWrapper(){
		$('#wrapper').toggle();
		$('#overlay').toggle();
	}

	// Update messageboard
	function status(msg) {
		$('#status').empty();
		$('#status').append(msg);
	}

	// ==========================================================================
	// INITIALIZE GAME
	// ==========================================================================
	function initiateGameType(gameMode, globalPlayer1, globalPlayer2) {
		if(gameMode == 'pve') {
			console.log('started a pve game');
		} else {
			console.log('started a pvp game');
			// Mutate currentGame object in order to prevent memory leaks with future games / lack of gc support
			currentGame = new pvpGame(globalPlayer1, globalPlayer2);
		}
		return;
	}

	function pvpGame(player1, player2) {
		// Initialize board, move, turn, turncounter, randomize players and avatars
		// var board = [null, null, null, null, null, null, null, null, null]
		// var turn = null;
		// var currentMove;
		// var turnCounter = 1;
		// var gameOver = false;
		// var players = [player1, player2];
		// var playerX = {
		// 	player : randomPlayer(player1, player2),
		// 	avatar : 'X'
		// }
		// var playerO = {
		// 	player : _.without(players, playerX.player)[0],
		// 	avatar : 'O'
		// }
		var self = this;

		self.board = [null, null, null, null, null, null, null, null, null],
		self.turn = null,
		self.currentMove = null,
		self.turnCounter = 1,
		self.gameOver = false,
		self.players = [player1, player2],
		self.playerX = {
			player : randomPlayer(player1, player2),
			avatar : 'X'
		},
		self.playerO = {
			player : _.without(self.players, self.playerX.player)[0],
			avatar : 'O'
		}

		function freshGame() {
			$('.box').empty();
			$('.box').removeClass('closed');
			$('.box').removeClass('O');
			$('.box').removeClass('X');
			$('.box').addClass('open');
		}

		// Game Control Flow
		freshGame();
		console.log('turncounter is ' + self.turnCounter);
		self.turn = self.playerX;
		status('<strong>Current Move: </strong>' + self.turn.player.name + ' is ' + self.turn.avatar);

		$('.box').on('click', function() {
			var convertToJqueryID = ('#' + this.id);
			self.currentMove = $(convertToJqueryID);
			move(self.currentMove);
			console.log("Turn: " + self.turnCounter);
			if(checkWin(self.turn.avatar) && self.gameOver === true) {
				updateScoreForWin();
				updateScoreBoard();
				status('<strong>' + self.turn.player.name + ' wins!</strong>');
				endGame();
			} else if (self.turnCounter < 10 && self.gameOver === false) {
				switchTurn()
			} else {
				updateScoreForDraw();
				updateScoreBoard();
				status('<strong>Draw game!</strong>');
				endGame();
			}
		})



		// Helper functions
		// Return randomized player
		function randomPlayer(player1, player2) {
			return (Math.floor(Math.random() * 2) == 0 ? player1 : player2);
		}

		// Conditional on click handler to process moves
		function move(square) {
			if(square.hasClass('open')) {
				square.removeClass('open');
				square.addClass('closed');
				square.addClass(self.turn.avatar);
				square.text(self.turn.avatar);
				var index = square.attr('id');
				self.board[index] = self.turn.avatar;
				self.turnCounter++;
			} else {
				// [Note] Call switchTurn on illegal move as double negative will handle this quite well.
				switchTurn();
				status('Invalid move! \n<strong>Current Move: </strong>' + self.turn.player.name + ' is ' + self.turn.avatar); 
			}
		}

		// Check for win condition
		function checkWin(avatar) {
			// First condition checks for null via max turn count
			if(self.board[0] == avatar && self.board[1] == avatar && self.board[2] == avatar) {
				self.gameOver = true;
				return true;
			} else if (self.board[3] == avatar && self.board[4] == avatar && self.board[5] == avatar) {
				self.gameOver = true;
				return true;
			} else if (self.board[6] == avatar && self.board[7] == avatar && self.board[8] == avatar) {
				self.gameOver = true;
				return true;
			} else if (self.board[0] == avatar && self.board[3] == avatar && self.board[6] == avatar) {
				self.gameOver = true;
				return true;
			} else if (self.board[1] == avatar && self.board[4] == avatar && self.board[7] == avatar) {
				self.gameOver = true;
				return true;
			} else if (self.board[2] == avatar && self.board[5] == avatar && self.board[8] == avatar) {
				self.gameOver = true;
				return true;
			} else if (self.board[0] == avatar && self.board[4] == avatar && self.board[8] == avatar) {
				self.gameOver = true;
				return true;
			} else if (self.board[2] == avatar && self.board[4] == avatar && self.board[6] == avatar) {
				self.gameOver = true;
				return true;
			} else {
				return false;
			}
		}

		function switchTurn() {
			if(self.turn == self.playerX && self.gameOver === false) {
				self.turn = self.playerO;
				status('<strong>Current Move: </strong>' + self.turn.player.name + ' is ' + self.turn.avatar);
			} else if(self.turn == self.playerO && self.gameOver === false) {
				self.turn = self.playerX;
				status('<strong>Current Move: </strong>' + self.turn.player.name + ' is ' + self.turn.avatar);
			}
		}

		function endGame() {
			updateScoreBoard();
			// Disable boxes to prevent score hacking
			$("#box *").attr("disabled", "disabled").off('click');

			if(confirm("Rematch?")) {
				currentGame = null;
				delete currentGame;
				currentGame = new pvpGame(globalPlayer1, globalPlayer2);
			}
		}

		function updateScoreForWin() {
			self.turn.player.wins++;
			_.without(self.players, self.turn.player)[0].losses++;
		}

		function updateScoreForDraw() {
			self.player1.draws++;
			self.player2.draws++;
		}

		function updateScoreBoard(){
			$('#player1-wins').text(player1.wins);
			$('#player1-losses').text(player1.losses);
			$('#player1-draws').text(player1.draws);

			$('#player2-wins').text(player2.wins);
			$('#player2-losses').text(player2.losses);
			$('#player2-draws').text(player2.draws);
		}

	} // <--- End of pvpGame 




} // <---- End of Global Container



// ***********
// Bug fix - Need to close the event handler upon "deleting reference to old game".
// **********



// ==========================================================================
// GAME ENGINE
// ==========================================================================

// Start PVP/PVE Game
// function pveGame(player1, player2) {
	// var game = new gameObject();
	// var playersArray = [player1, player2];
	// firstRandomPlayer = randomPlayer(player1, player2);
	// playersArray.splice(firstRandomPlayer, 1);
	// game.player1 = firstRandomPlayer;
	// game.player1.avatar = 'X';
	// game.player2 = playersArray[0];
	// game.player2.avatar = 'O';
	// game.turn = game.player1.avatar;

	// console.log('player1 is '+ player1.name);
	// console.log('player2 is '+ player2.name);

// 	self.player1 = player1,
// 	self.player2 = player2,
// 	self.turn = null,
// 	self.gameOver = false

// - Assign avatar
// - assign turn order
// - update message board
// }









// ==========================================================================
// GAME MECHANICS
// ==========================================================================





// Reqs
// - Switch in globalcontainer to tell if gameOver
// - If gameOver, ask to play again



// --------
// - Game variables
// • turn
// • over?
// • winner
// • loser

// - Game Handlers
// • Click Handlers
// • Win/loss conditions
// • draw conditions
// • Update scoreboard
// • New game