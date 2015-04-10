var Audio = (function () {
    var audio;
    var playing = false;
    var displayTimer = null;
    var trackDoneCount;

    var play = function (id) {
        $('#player').show();
        $('#audio_player').hide();
        $('#wp_audio_player').show();

        if (displayTimer != null) {
            clearInterval(displayTimer);
        }

        var info = Data.GetCachedCurrentMediaList();
        var result = $.grep(info, function (item) {
            return item.id == id;
        });

        playAudio(result[0].title, result[0].url);
        showPauseIcon();

        if (playing) {
            clearInterval(displayTimer);
        }

        displayTimer = setInterval(displayStatus, 1000);
        playing = true;
    };

    var seek = function (value) {
        audio.seekPositionAudio(value);
    };

    var playAudio = function (title, src) {
        showMediaTitle(title);

        var currentTopic = Data.GetCurrentTopic();
        try {
            if (audio == null) {
                audio = new BackgroundAudio(null, onError, null);
            }
            audio.play([src, title, currentTopic]);
        } catch (e) {
            alert(e);
        }
    };

    var pause = function () {
        if (playing) {
            //pause
            showPlayIcon();
            clearInterval(displayTimer);
            audio.pause();
            playing = false;
        } else {
            //play
            showPauseIcon();
            audio.pause();
            displayTimer = setInterval(displayStatus, 1000);
            playing = true;
        }
    };

    function displayStatus() {
        audio.getCurrentPosition(function (pos) {
            if (pos == 0) {
                trackDoneCount++;
            }
            else {
                trackDoneCount = 0;
            }

            if (trackDoneCount > 5) {
                playing = false;
                clearInterval(displayTimer);
            }

            $('#audio_position').text(toString(pos));
            $('#audio_left').text(audio._duration > 0 ? ("-" + toString(audio._duration - pos)) : "Live broadcast");
        }, null);
    }

    function onError(e) {
        alert(e);
    }

    function onStatus(e) {
        alert(e);
    }

    function showMediaTitle(title) {
        $("#player-media-name").html(title);
    }

    function showPauseIcon(){
        $('#wp_audio_player_control').removeClass('fa-play').addClass('fa-pause');
    }

    function showPlayIcon() {
        $('#wp_audio_player_control').removeClass('fa-pause').addClass('fa-play');
    }

    function toString(sec) {
        if (sec == -1) {
            return "--:--:--";
        }
        var date = new Date(null);
        date.setSeconds(sec); // specify value for SECONDS here
        return date.toISOString().substr(11, 8);
    }

    return {
        Play: play,
        Pause: pause,
        Seek: seek
    };
})();