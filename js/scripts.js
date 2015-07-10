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
		this.id = id,
		this.name = "",
		this.wins = 0,
		this.losses = 0,
		this.draws = 0,
		this.avatar = ""
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
			currentGame = new pvpGame(globalPlayer1, globalPlayer2);
		}
		return;
	}

	function pvpGame(player1, player2) {
		// Initialize board, move, turn, turncounter, randomize players and avatars
		var board = [null, null, null, null, null, null, null, null, null]
		var turn = null;
		var current_move;
		var turnCounter = 0;
		var gameOver = false;
		var players = [player1, player2];
		var playerX = {
			player : randomPlayer(player1, player2),
			avatar : 'X'
		}
		var playerO = {
			player : _.without(players, playerX.player)[0],
			avatar : 'O'
		}

		// Game Control Flow
		turn = playerX;
		turnCounter += 1;
		status('<strong>Current Move: </strong>' + turn.player.name + ' is ' + turn.avatar);

		$('.box').on('click', function() {
			var convertToJqueryID = ('#' + this.id);
			current_move = $(convertToJqueryID);
			move(current_move);
			if(checkWin(turn.avatar)) {
				alert('winner');
				endGame();
			} else if (checkWin(turn.avatar) === null) {
				alert('draw');
				endGame();
			} else {
				switchTurn();
			}
		})



		// Helper functions
		// Return randomized player
		function randomPlayer(player1, player2) {
			return (Math.floor(Math.random() * 2) == 0 ? player1 : player2);
		}

		// Conditional on click handler to process moves
		function move(square) {
			if(square.hasClass('closed') && gameOver === false) {
				status('<strong>Current Move: </strong>' + turn.player.name + ' is ' + turn.avatar + '\nInvalid move. Please choose an empty box.');
			} else if (square.hasClass('open') && gameOver === false) {
				square.removeClass('open');
				square.addClass('closed');
				square.text(turn.avatar);
				var index = square.attr('id');
				board[index] = turn.avatar;
			}
		}

		// Check for win condition
		function checkWin(avatar) {
			if (gameOver === false && turnCounter == 9) {
				return null;
			} else if(board[0] == avatar && board[1] == avatar && board[2] == avatar) {
				gameOver = true;
				return true;
			} else if (board[3] == avatar && board[4] == avatar && board[5] == avatar) {
				gameOver = true;
				return true;
			} else if (board[6] == avatar && board[7] == avatar && board[8] == avatar) {
				gameOver = true;
				return true;
			} else if (board[0] == avatar && board[3] == avatar && board[6] == avatar) {
				gameOver = true;
				return true;
			} else if (board[1] == avatar && board[4] == avatar && board[7] == avatar) {
				gameOver = true;
				return true;
			} else if (board[2] == avatar && board[5] == avatar && board[8] == avatar) {
				gameOver = true;
				return true;
			} else if (board[0] == avatar && board[4] == avatar && board[8] == avatar) {
				gameOver = true;
				return true;
			} else if (board[2] == avatar && board[4] == avatar && board[6] == avatar) {
				gameOver = true;
				return true;
			} else {
				return false;
			}
		}

		function switchTurn() {
			if(turn == playerX && gameOver === false) {
				turn = playerO;
				turnCounter ++;
				status('<strong>Current Move: </strong>' + turn.player.name + ' is ' + turn.avatar);
			} else if( turn == playerO && gameOver === false) {
				turn = playerX;
				turnCounter ++;
				status('<strong>Current Move: </strong>' + turn.player.name + ' is ' + turn.avatar);
			}
		}

		function endGame() {
			console.log("turn #" + turnCounter);
			console.log("gameover = " + gameOver);
		}

	} // <--- End of pvpGame 




} // <---- End of Global Container

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

// 	this.player1 = player1,
// 	this.player2 = player2,
// 	this.turn = null,
// 	this.gameOver = false

// - Assign avatar
// - assign turn order
// - update message board
// }









// ==========================================================================
// GAME MECHANICS
// ==========================================================================

function MakeMove() {

}





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