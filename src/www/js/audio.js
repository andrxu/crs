"use strict";

var Audio = (function () {
    var current_title;
    var audio = $("#audio_player")[0];

    var play = function (id) {
        $('#player').show();
        var info = Data.GetCachedCurrentMediaList();
        var result = $.grep(info, function (item) {
            return item.id == id;
        });

        if (current_title != result[0].title) {
            current_title = result[0].title; 
            playAudio(result[0].title, result[0].url);
        }else if (audio.paused) {
            audio.play();
        }
    };

    var playAudio = function (title, src) {
        $("#player-media-name").html(title);

        audio.src = src;
        audio.load();
        audio.play();
    };

    var pause = function () {
        audio.pause();
    };

    return {
        Play: play,
        Pause: pause
    };
})();