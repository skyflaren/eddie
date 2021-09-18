$(document).ready(function() {
	var audioElement = document.createElement("audio");
	audioElement.src = "https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/sound/chatsounds/autoadd/snoop_dogg/hold%20up%20wait.ogg";
    $('#start').click(function(){
        audioElement.play();
    });

    // let url = chrome.runtime.getURL("https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/sound/chatsounds/autoadd/snoop_dogg/hold%20up%20wait.ogg");
    // let a = new Audio(url);
    // a.play();
}