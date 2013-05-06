// Storage is a one key value (string:string) pair
// We have one object: songQueue
// The most recent song is at the end
// The next song to be played is at the beginning

function Queue() {
    this._player = null;

	// Checks for browser support of the localStorage
	this._checkBrowserSupport = function() {
		if (typeof(localStorage) == 'undefined' ) {
			alert('Your browser does not support HTML5 localStorage. Musiq won\'t work properly. Try upgrading :).');
		}
        else {
			return true;
		}
	};

	this._initializeDB = function() {
		// If the DB doesn't exist, creates it and returns true
		// else returns null
		if (localStorage['songQueue'] === undefined) {
			var emptyQueue = '{"queue":[]}';
			localStorage['songQueue'] = emptyQueue;
			return true;
		}
		else {
			return null;
		}
	};

	this.getQueue = function() {
		// Returns the queue as an ordered list of song objects
		this._initializeDB();
		var result = JSON.parse(localStorage['songQueue']);
		return result['queue']
	};

	this.setQueueFromList = function(jsonQueueList) {
		var stringQueue = JSON.stringify({'queue':jsonQueueList});
		localStorage['songQueue'] = stringQueue;
	};

	this.popNextSong = function() {
		// @TODO:to become pop
		// Returns the first song if it exists else null
		var queue = this.getQueue();
		if (queue[0]) {
			result = queue.shift();
			this.setQueueFromList(queue);

			return result;
		}
		else {
			return null;
		}
	};

	this.getSongByIdentifier = function(identifier, value) {
		// returns a specific song chosen by an identifier and it's string value
		// If this doesn't work: returns null
		try {
			var queue = this.getQueue();
			var result = {}
			for(var i = 0; i < queue.length; i++) {
				if (queue[i][identifier] === value) {
					return queue[i]
				}
			}
		}
		catch (errorCode) {
			return null;
		}
	};

    this._addSongCompleted = function(song) {
		// Adds a song object to the queue
		// The argument is a JS object
		// Returns the new queue
		q = queue.getQueue();

        // TODO: Check if the song object already exists in the queue
		q.push(song);
		this.setQueueFromList(q);
        this._player.dispatchEvent('added_song');
        console.log("Song creation completed");
    };

	this.addSong = function(songUrl) {
        // Instanciate a new song object
        var song = new Song(songUrl, this._addSongCompleted);
	};

	this.removeSong = function(index) {
		// Removes the song at the index passed as a parameter
		// Returns the new queue
		var queue = this.getQueue();
		try {
			queue.splice(index,1);
			this.setQueueFromList(queue);
			return queue;
		}
		catch (errorCode) {
			return false
		}
	};

    this.bindPlayer = function(player) {
        this._player = player;
    }

	// Init setup
	if (this._checkBrowserSupport())
		this._initializeDB();

    // Setup Listeners

}

Queue.prototype = new Dispatcher();


function Player(q) {
	// Init setup
	this._song = null;
	this._player = $("#player")[0];
    if (q)
        this._queue = q;

	this.play = function() {
		this._player.play();
	};
	this.playNextSong = function() {
        var nextSong = this._queue.popNextSong();
		if (nextSong) {
			this._song = nextSong;
			this._player.setAttribute("src", this._song.streamUrl);
			return this;
		}
		else {
			throw "Object loaded in the Player is not a Song"
		}
	};
	this.pause = function() {
		this._player.pause();
	};
	this.stop = function() {
		this._player.stop();
	};
	this.currentTime = function() {
		return this._player.currentTime;
	};
	this.goTo = function(time) {
		if (time <= this._player.duration) {
			this._player.currentTime = time;
		}
		else {
			console.log("The time is longer than the song duration");
		}
	};
	// Event Listener Callbacks
	this._songEnded = function() {
        this.playNextSong();
	}
    this._queueAddedSong = function() {
        console.log("QUEUE ADDED SONG");
    }

    // Setup Listeners
    console.log(this.addEventListener);
    console.log(this.addEventListener);
    console.log(this.addEventListener);
    // this._player.addEventListener('ended', this._songEnded);
    // this._queue.addEventListener('added_song', this._queueAddedSong)


    console.log(this.addEventlistener);
}

Player.prototype = new Dispatcher();

$(document).ready(function() {
    q = new Queue();
    p = new Player(q);
});



// function A() {
//     // Dispatcher.call(this);
//     this._b = null;
//
//     this.bind = function(b) {
//         this._b = b
//     }
//
//     console.log(this.addEventlistener);
//
//     this.send = function() {
//         console.log(this._b.dispatch);
//         console.log(b);
//         this._b.dispatch("PLOP")
//     }
// }
// A.prototype = new Dispatcher();
//
// var a = new A();
//
// function B(foo) {
//     // Dispatcher.call(this);
//     this._foo = foo;
//
//     this.receiver = function(event) {
//         console.log(event);
//     }
//
//     this.addEventlistener("plop", this.receiver);
// }
// B.prototype = new Dispatcher();
//
// var b = new B(a);
// a.bind(b);
// a.send()
//
//
//
// // SomeClass.prototype.sendSomeEvent=function(){
// //     this.dispatch("test");
// // }
//
// // foo.addEventlistener( "test", function(){ console.log("bah"); } )
// // foo.sendSomeEvent();
