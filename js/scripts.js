$(document).ready(function() {
	ticTacToe();
});

// ==========================================================================
// MASTER CONTROLLER
// ==========================================================================

// Constructor function for the application aka Master Controller for the app
function ticTacToe() {
	var gameMode, player1, player2;
	gameMenu(player1, player2);


}

// ==========================================================================
// INITIALIZE GAME SETTINGS
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

// Constructor function to prototype game object
function gameObject() {
	this.player1 = null,
	this.player2 = null,
	this.turn = null,
	this.gameOver = false
}

// --------------------------------------------------------------------------

// Event driven game menu with callbacks to render and start game
function gameMenu(player1, player2) {
	$('#pve-button').click(function() {
		gameMode = 'pve';
		initializeScoreboard(player1, player2);
		toggleWrapper();
	})

	$('#pvp-button').click(function() {
		gameMode = 'pvp';
		initializeScoreboard(player1, player2);
		toggleWrapper();
		startPVPGame(player1, player2);
	})
}

// Helper function for gameMenu
// Passing the player1 & player2 arguments allows us to manage scope and event handler within tictactoe()
function initializeScoreboard(player1, player2) {
	// initialize for 1 player vs AI
	if(gameMode == 'pve') {
		player1 = new player(1);
		player1.name = prompt('Please enter name for player 1');
		$('#player1-name').text(player1.name);
		
		player2 = new player(2);
		var namesArray = ['Evil Robot', 'T-1000', 'Cylon', 'Megatron', 'SkyNet'];
		player2.name = namesArray[Math.floor(Math.random()*namesArray.length)];
		$('#player2-name').text(player2.name);

	} else {
	// initialize for 2 players head to head
		player1 = new player(1);
		player1.name = prompt('Please enter name for player 1');
		$('#player1-name').text(player1.name);

		player2 = new player(2);
		player2.name = prompt('Please enter name for player 2');
		$('#player2-name').text(player2.name);
	}
}

// Close overlay and render wrapper
function toggleWrapper(){
	var wrapper	= $('#wrapper');
	var overlay = $('#overlay');
	wrapper.toggle();
	overlay.toggle();
}

// --------------------------------------------------------------------------


// ==========================================================================
// GAME ENGINE
// ==========================================================================

// Start PVP Game
function startPVPGame(player1, player2) {
	var game = new gameObject();
	var playersArray = [player1, player2];
	firstRandomPlayer = randomPlayer(player1, player2);
	playersArray.splice(firstRandomPlayer, 1)
	game.player1 = firstRandomPlayer;
	game.player1.avatar = 'X';
	game.player2 = playersArray[0];
	game.player2.avatar = 'O';
	game.turn = game.player1.avatar

	console.log('player1 is '+ game.player1.name);
	console.log('player2 is '+ game.player2.name);

// 	this.player1 = player1,
// 	this.player2 = player2,
// 	this.turn = null,
// 	this.gameOver = false

// - Assign avatar
// - assign turn order
// - update message board

}

function randomPlayer(player1, player2) {
	return (Math.floor(Math.random() * 2) == 0 ? player1 : player2);
}




// ==========================================================================
// GAME MECHANICS
// ==========================================================================

function MakeMove() {

}


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