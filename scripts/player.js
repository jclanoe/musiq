function Player(queue) {
	// Init setup
    this.self = this;
	this._song = null;
	this._audio = $("#player")[0];
    if (queue)
        this._queue = queue;

	this.play = function() {
        if (this._audio.getAttribute('src') == null) {
            console.log("NEXT SONG…");
            this.playNextSong();
        }
        else {
    		this._audio.play();
        }
	};
	this.playNextSong = function() {
        var nextSong = this._queue.popNextSong();
        console.log(nextSong);
		if (nextSong) {
            console.log("PLAYING NEXT SONG NOW");

            var popoverWindow = getPopoverWindow();
            console.log(popoverWindow);
            popoverWindow.popSongFromQueue();

			this._song = nextSong;
			this._audio.setAttribute('src', this._song.streamUrl);
            console.log(this._audio.getAttribute('src'));
            this.play();
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
		player._audio.pause();
        player._audio.removeAttribute("src");
	};
    this.next = function() {
        player._song = null;
        player._audio.pause();
        player._audio.removeAttribute("src");
        player.playNextSong();
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
    this._ff = function() {
        this._audio.currentTime = (this._song.duration / 1000) - 15;

    }
	// Event Listener Callbacks
	this._songEnded = function() {
        player._audio.removeAttribute("src");
        player.play();
    };
    this._queueAddedSong = function(event) {
        if (this._song == null) {
            player.playNextSong();
        }
    };

    // Setup HTML5 Audio Player
    if (isChrome()) {

    }
    else if (isSafari()) {
        var popoverWindow = getPopoverWindow();
        popoverWindow.$('body').append('<audio id="audioplayer" autooad="true"></audio>')
        this._audio = popoverWindow.$('#audioplayer')[0];
    }

    // Setup Listeners
    this._audio.addEventListener('ended', this._songEnded);
    this._queue.addEventListener('added_song', this._queueAddedSong)
}

Player.prototype = new Dispatcher();
