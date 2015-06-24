// On document ready, instantiate globalContainer
$(document).ready(function() {
	globalContainer();
});

// ==========================================================================
// MASTER CONTROLLER aka globalContainer
// ==========================================================================
// Constructor for global container
// 	- This design allows for persistent scorekeeping with newer games
// 	- Deters javascript hacking to manipulate the score

function globalContainer() {
	var globalSettings = new globalSettingsObject;
	var globalPlayer1 = new player(1);
	var globalPlayer2 = new player(2);

	// event driven gameMenu with callbacks to handle initializers
	gameMenu(globalSettings, globalPlayer1, globalPlayer2);

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

	// Constructor function to prototype settings object
	function globalSettingsObject() {
		this.gameMode = "",
		this.gameOver = true;
	}

	// ==========================================================================
	// INITIALIZE SETTINGS
	// ==========================================================================

	function gameMenu(globalSettings, globalPlayer1, globalPlayer2) {
		$('#pve-button').click(function() {
			globalSettings.gameMode = 'pve';
			
			// initialize scoreboard, set player names
			initializeScoreboard(globalSettings, globalPlayer1, globalPlayer2);

			// Closes overlay
			toggleWrapper();

			// Start game initializer
			startGame(globalSettings, globalPlayer1, globalPlayer2);
		})

		$('#pvp-button').click(function() {
			globalSettings.gameMode = 'pvp';

			// initialize scoreboard, set player names
			initializeScoreboard(globalSettings, globalPlayer1, globalPlayer2);

			// Closes overlay
			toggleWrapper();

			// Start game initializer
			startGame(globalSettings, globalPlayer1, globalPlayer2);
		})
	}

	function initializeScoreboard(globalSettings, globalPlayer1, globalPlayer2) {
		// initialize for 1 player vs AI
		if(globalSettings.gameMode == 'pve') {
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
		var wrapper	= $('#wrapper');
		var overlay = $('#overlay');
		wrapper.toggle();
		overlay.toggle();
	}


	// ==========================================================================
	// INITIALIZE GAME
	// ==========================================================================
	function startGame(globalSettings, globalPlayer1, globalPlayer2) {
		globalSettings.gameOver = false;

		if(globalSettings.gameMode == 'pve') {
			pveGame(globalPlayer1, globalPlayer2);
			console.log('started a pve game');
		} else {
			pvpGame(globalPlayer1, globalPlayer2);
			console.log('started a pvp game');
		}
		return;
	}

} // <---- End of Global Container

// ==========================================================================
// GAME ENGINE
// ==========================================================================

// Start PVP Game
function pveGame(player1, player2) {
	// var game = new gameObject();
	// var playersArray = [player1, player2];
	// firstRandomPlayer = randomPlayer(player1, player2);
	// playersArray.splice(firstRandomPlayer, 1);
	// game.player1 = firstRandomPlayer;
	// game.player1.avatar = 'X';
	// game.player2 = playersArray[0];
	// game.player2.avatar = 'O';
	// game.turn = game.player1.avatar;

	console.log('player1 is '+ player1.name);
	console.log('player2 is '+ player2.name);

// 	this.player1 = player1,
// 	this.player2 = player2,
// 	this.turn = null,
// 	this.gameOver = false

// - Assign avatar
// - assign turn order
// - update message board
}

function pvpGame(player1, player2) {
	console.log('player1 is '+ player1.name);
	console.log('player2 is '+ player2.name);
}


function randomPlayer(player1, player2) {
	return (Math.floor(Math.random() * 2) == 0 ? player1 : player2);
}




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