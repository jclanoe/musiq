// Storage is a one key value (string:string) pair
// We have one object: songQueue
// The most recent song is at the end
// The next song to be played is at the beginning

function Queue() {
    this._init = function() {
    	if (this._checkBrowserSupport())
    		this._initializeDB();
        var popoverWindow = getPopoverWindow();
        if (popoverWindow && popoverWindow.addSongToQueue) {
            var queue = this.getQueue();
            // Populate the queue with the songs stored in the database
            $.each(queue, function(index, song) {
                popoverWindow.addSongToQueue(song);
            });
        }
    }

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
        console.log(song);
        console.log(this);
        // this.dispatchEvent('added_song');
        console.log("Song creation completed");
        var popoverWindow = getPopoverWindow();
        popoverWindow.addSongToQueue(song);
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

	this.moveSong = function(fromIndex, toIndex) {
		// Removes the song at the index passed as a parameter
		// Returns the new queue
		var queue = this.getQueue();
		try {
            queue.move(fromIndex, toIndex);
			this.setQueueFromList(queue);
			return queue;
		}
		catch (errorCode) {
			return false
		}
	};

	// Init setup
    this._init();
}

Queue.prototype = new Dispatcher();
