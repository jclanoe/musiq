function Player(queue) {
	this.play = function() {
		this._player.play();
	};
	this._playNextSong = function() {
		if (song && song instanceof Song) {
			this.song = song;
			this._player.setAttribute("src", this.song.streamUrl);
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
	this.songEnded = function() {
        this._playNextSong();
	}
	
	// Init setup
    this.queue = null;
	this.song = null;
    if (queue)
        this.queue = queue;
    
	this._player = $("#player")[0];
    // Set Listeners
	this._player.addEventListener('ended', this.songEnded);
}
