function Player(queue) {
	// Init setup
    this.self = this;
	this._song = null;
	this._audio = $("#player")[0];
    if (queue)
        this._queue = queue;

	this.play = function() {
		this._audio.play();
	};
	this.playNextSong = function() {
        var nextSong = this._queue.popNextSong();
		if (nextSong) {
			this._song = nextSong;
			this._audio.setAttribute("src", this._song.streamUrl);
            this._audio.play();
			return this;
		}
		else {
			throw "There is not any more song to play"
		}
	};
	this.pause = function() {
		this._audio.pause();
	};
	this.stop = function() {
		this._audio.stop();
	};
	this.currentTime = function() {
		return this._audio.currentTime;
	};
	this.goTo = function(time) {
		if (time <= this._audio.duration) {
			this._audio.currentTime = time;
		}
		else {
			console.log("The time is longer than the song duration");
		}
	};
	// Event Listener Callbacks
	this._songEnded = function() {
        this.playNextSong();
    };
    this._queueAddedSong = function(event) {
        if (this._song == null) {
            player.playNextSong();
        }
    };

    // Setup Listeners
    this._audio.addEventListener('ended', this._songEnded);
    this._queue.addEventListener('added_song', this._queueAddedSong)
    console.log(this._queue.events);
}

Player.prototype = new Dispatcher();
