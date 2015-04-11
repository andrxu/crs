"use strict";

var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

        if (!window.device) {
            window.device = {
                platform: 'Browser'
            };
        }
    },
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    },
    goHome: function () {
        var topic = '';
        var defaultAudioItem = 0;
        showLoadingSpinner(true);
        Data.ChooseTopic(topic, renderMediaListView);
        setActiveListItem(defaultAudioItem);
        setTimeout(function () { showLoadingSpinner(false); }, 500);
    },
    showMore: function () {
        showNavPanel();
    },
};

$(document).ready(function () {
    app.initialize();
    setActiveListItem(0);
    $('.navlink').click(function (e) {
        $('.navlink').each(function (i) {
            $(this).css('color', 'black');
        });
        $(this).css('color', 'red');
        var topic = $(this).attr('data');
        Data.ChooseTopic(topic, renderMediaListView);
        setTimeout(function () { hideNavPanel() }, 2000);
    });
    setHoverEffectOnListItems();
    $('.navlink').first().trigger('click');
});

function setActiveListItem(index) {
    $('.navlink').each(function (i) {
        $(this).css('color', i === index ? 'red' : 'black');
    });
}

var renderMediaListView = function (topic, data, isRefreshing) {
    imageSlider.hide();
    var isHomePage = topic == '';
    var items = data.Items;

    if (isRefreshing && isHomePage) {
        imageSlider.slick();
    }

    var imageCounter = 0;
    var output = '';
    $.each(items, function (i, data) {
        output += '<li data-icon="audio"><a href="#" id="' + data.id + '" onClick=playAudio(' + data.id + ')>' + data.title;

        if (data.detail != null && data.detail.length > 0) {
            output += '<span class="small">' + data.detail +  '</span></li>';
        }
        output +=  '</a></li>';
        if (data.imageUrl != null && data.imageUrl.length > 0 && isHomePage) {
            imageCounter++;
            if (isRefreshing) {
                imageSlider.add(data.imageUrl, data.id);
            }
        }
    });

    if (imageCounter > 0) {
        imageSlider.goTo(0);
        imageSlider.show();
    }

    $('#listitems').html(output);
    $('#listitems').listview('refresh');
}

var playAudio = function (id) {
    var wasVisible = $('#player').is(':hidden');
    Audio.Play(id);
    if (wasVisible) {
        $('#listitems').listview('refresh');
    }
}

function showLoadingSpinner(show) {
    $.mobile.loading(show ? "show" : "hide");
}

function showNavPanel() {
    $("#navPanel").panel("open");
}

function hideNavPanel() {
    $("#navPanel").panel("close");
}

function setHoverEffectOnListItems() {
    // style the list item when it is clicked!
    $('#listitems').on('mousedown touchstart', 'li', function () {
        $(this).addClass('activeLI');
    });
    $('#listitems').on('mouseup touchend', 'li', function () {
        $(this).removeClass('activeLI');
    });
    $('#listitems').on('mouseleave touchend', 'li', function () {
        $(this).removeClass('activeLI');
    });
}

function openLink(url) {
    if (typeof device != 'undefined' &&
            device.platform.toUpperCase() === 'ANDROID') {
        navigator.app.loadUrl(url, {
            openExternal: true
        });
        e.preventDefault();

    } else if (typeof device != 'undefined' &&
            device.platform.toUpperCase() === 'IOS') {
        window.open(url, '_system');
        e.preventDefault();
    } else {
        window.location.href = url;
        window.location.replace(url);
    }
}

var imageSlider = {
    slick: function () {
        var slick = $('.images_slider');
        slick.unslick();
        slick.html('');
        slick.slick({
            infinite: true,
            autoplay: true,
            autoplaySpeed: 20000,
            dots: true,
            slidesToShow: 1,
            slidesToScroll: 1,
        });
    },
    show: function () {
        var slick = $('.images_slider');
        slick.show();
    },
    hide: function () {
        var slick = $('.images_slider');
        slick.hide();
    },
    goTo: function (id) {
        var slick = $('.images_slider');
        slick.slickGoTo(id);
    },
    add: function (url, audioIndex) {
        var w = Math.min($(document).width(), 500);
        var h = (w * 200 / 300);
        $('.images_slider').slickAdd('<div><a onClick=Data.PlayAudio(' + audioIndex + ')><img src="' + url + '?w=' + w + '&h=' + h + '"/></a></div>');
    }
};