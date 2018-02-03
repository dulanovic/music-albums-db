function play(link) {
	var audioPlayer = document.getElementById("player");

	if (audioPlayer.duration > 0 && !audioPlayer.paused) {
		audioPlayer.pause();
		audioPlayer.currentTime = 0;
		var slicica = document.getElementById(link);
		slicica.setAttribute("src", "/slike/play.png");

		if (audioPlayer.currentSrc == link) {
			var slicica = document.getElementById(link);
			slicica.setAttribute("src", "/slike/play.png");
			return;
		} else {
			for (var i = 0; i < document.getElementsByClassName("play-dugme").length; i++) {
				document.getElementsByClassName("play-dugme")[i].src = "/slike/play.png";
			}
		}
	}

	audioPlayer.setAttribute("src", link);
	audioPlayer.play();
	audioPlayer.onended = function() {
		var slicica = document.getElementById(link);
		slicica.setAttribute("src", "/slike/play.png");
	}

	var slicica = document.getElementById(link);
	slicica.setAttribute("src", "/slike/pause.png");
}