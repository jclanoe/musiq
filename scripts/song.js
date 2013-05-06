function Song(url, completionCallback) {
	this.init = function() {
		if (!this.originUrl)
			throw "Song must have a streaming URL";

		// Detect the music provider to know how to build the Song object
		this._detectProvider(self);
	};

	this._buildSongInfo = function() {
		var self = this;
		if (this.provider == "soundcloud") {
			SC.get('/resolve', { url: this.url }, function(track) {
				if (track && track.streamable && track.stream_url) {
					self.streamUrl = track.stream_url + "?client_id=" + CLIENT_ID_SOUNDCLOUD;
					self.providerSongId = track.id;
					self.artworkUrl = track.artwork_url;
					self.title = track.title;
					self.artist = track.user.username;
					self.duration = track.duration;

                    // Call the song completion callback
                    if (completionCallback)
                        completionCallback.call(queue, self);
				}
                else {
                    throw "This song cannot be streamed"
                }
			});
		}
		else {
			throw "Unknown Music Provider"
		}
	}

	this._detectProvider = function(isSecondDetection) {
		// Try to detect a music provider with a URL pattern

		// We recorgnized the music provider
		if (SOUNDCLOUD_URL_REGEX.test(this.originUrl)) {
			this.provider = "soundcloud";
		}

		if (this.provider) {
			this._buildSongInfo(self);
			return;
		}

		if (!isSecondDetection) {
			// The URL might be tinified
			// Try to expand the URL with api.longurl.org
		    $.ajax({
		        self: this,
		        type: "GET",
		        data: {
		            'url': url,
		            'format': 'json',
					'response-code': 1,
		        },
		        url: 'http://api.longurl.org/v2/expand',
		        success: function (data, status, xhr) {
		            if (xhr.status == 200 && data["response-code"] == "200" && data && data['long-url']) {
						// Try to detect the URL pattern one more time
		                this.self._detectProvider(true);
						return;
		            }
					throw "Invalid Song URL";
		        },
				error: function(data) {
					throw "Invalid Song URL";
				},
		    });
			return;
		}
	};

	this.originUrl = url;
	// Final song URL
	this.url = url;
	// Storage ID
	this.id = null;
	// Song identifier in the provider platform
	this.providerSongId = null
	// Provider name
	this.provider = null;
	// Stream URL
	this.streamUrl = null;
	this.artworkUrl = null;
	this.title = null;
	this.artist = null;
	this.duration = null;

	// Call the init function
	this.init(this);
}
