"use strict";

var Data = (function () {
    var dataMap = {}; // a hash table contains media information of all topics, each one has two properties {Items, Timestamp}
    var currentTopic; // current topic 
    var serviceUrl = "http://mobi2cloud.com/apps/crs/api/v3/medias/?topic=";

    var chooseTopic = function (topic, callback) {
        currentTopic = topic;

        if ((topic in dataMap && isExpired(dataMap[topic].Timestamp)) ||
            !(topic in dataMap)) {
            downloadMediaListByTopic(topic, callback);
            return;
        }
        callback && callback(topic, dataMap[topic], false);
    };

    var downloadMediaListByTopic = function (topic, callback) {
        showLoadingSpinner(true);
        $.getJSON(serviceUrl + topic, {
            format: "json"
        })
            .done(function (items) {
                processData(topic, items, callback);
            })
            .fail(function (jqXhr, textStatus, errorThrown) {
                if (textStatus == "parsererror" && jqXhr.status == 200) {
                    var text = jqXhr.responseText;
                    var begin = text.indexOf("[{");
                    var end = text.indexOf("}]");
                    var items = JSON.parse(text.substr(begin, end - begin + 2));
                    processData(topic, items);
                } else {
                    alert("Sorry: downloading the program list failed.\r\n\r\nYou may want to check the network connection and try again.\r\n\r\nStatus: "
                        + textStatus + "\r\nHTTP code: " + jqXhr.statusText);
                }
            })
            .always(function () {
                showLoadingSpinner(false);
            });
    };

    function processData(topic, items, callback) {
        var data = {
            Items: items,
            Timestamp: new Date()
        };
        dataMap[topic] = data;
        callback && callback(topic, data, true);
    }

    var getCurrentTopic = function () {
        return currentTopic;
    };

    var getCachedCurrentMediaList = function () {
        return dataMap[currentTopic].Items;
    };

    var refreshMediaList = function () {
        downloadMediaListByTopic(currentTopic);
    };

    var isExpired = function (a) {
        var b = new Date();
        if (a.getYear() != b.getYear())
            return true;
        if (a.getMonth() != b.getMonth())
            return true;
        if (a.getDay() != b.getDay())
            return true;
        if ((b.getHours() - a.getHours()) > 4)
            return true;

        return false;
    };

    return {
        ChooseTopic: chooseTopic,
        RefreshMediaList: refreshMediaList,
        GetCachedCurrentMediaList: getCachedCurrentMediaList,
        GetCurrentTopic: getCurrentTopic
    };
})();