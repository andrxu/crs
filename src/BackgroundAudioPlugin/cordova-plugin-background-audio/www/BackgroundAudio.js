/*
 * mobi2cloud LLC
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');

var media;

/**
 * This class provides access to the Windows Phone's background audio
 *
 * @constructor
 * @param successCallback       The callback to be called when the file is done playing or recording.
 *                                  successCallback()
 * @param errorCallback         The callback to be called if there is an error.
 *                                  errorCallback(int errorCode) - OPTIONAL
 * @param statusCallback        The callback to be called when media status has changed.
 *                                  statusCallback(int statusCode) - OPTIONAL
 */
var backgroundAudio = function (successCallback, errorCallback, statusCallback) {
    argscheck.checkArgs('FFF', 'BackgroundAudio', arguments);
    media = this;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.statusCallback = statusCallback;
    this._duration = -1;
    this._position = -1;
    exec(null, this.errorCallback, "BackgroundAudio", "Create", [this.id]);
};

// Media messages
backgroundAudio.MEDIA_STATE = 1;
backgroundAudio.MEDIA_DURATION = 2;
backgroundAudio.MEDIA_POSITION = 3;
backgroundAudio.MEDIA_ERROR = 9;
/**
* PUBLIC functions
*/
backgroundAudio.prototype.play = function (options) {
    this._duration = -1;
    exec(null, null, "BackgroundAudio", "Play", [this.id, options]);
};

backgroundAudio.prototype.getCurrentPosition = function (success, fail) {
    var me = this;
    exec(function (p) {
        me._position = p;
        success(p);
    }, fail, "BackgroundAudio", "GetCurrentPosition", [this.id]);
};

backgroundAudio.prototype.seekPositionAudio = function (options) {
    exec(null, null, "BackgroundAudio", "Seek", [this.id, options]);
};

backgroundAudio.prototype.pause = function () {
    exec(function () {
    }, this.errorCallback, "BackgroundAudio", "PauseResume", [this.id]);
};

/**
* Audio has status update.
* PRIVATE
*
* @param id            The media object id (string)
* @param msgType       The 'type' of update this is
* @param value         Use of value is determined by the msgType
*/
backgroundAudio.onStatus = function (id, msgType, value) {
    switch (msgType) {
        case backgroundAudio.MEDIA_STATE:
            media.statusCallback && media.statusCallback(value);
            break;
        case backgroundAudio.MEDIA_DURATION:
            media._duration = Number(value);
            break;
        case backgroundAudio.MEDIA_ERROR:
            media.errorCallback && media.errorCallback(value);
            break;
        case backgroundAudio.MEDIA_POSITION:
            media._position = Number(value);
            break;
        default:
            console.error && console.error("Unhandled Media.onStatus :: " + msgType);
            break;
    }
};

module.exports = backgroundAudio;
