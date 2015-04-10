using System;
using System.Globalization;
using System.Windows;
using Microsoft.Phone.BackgroundAudio;
using WPCordovaClassLib.Cordova.JSON;

namespace WPCordovaClassLib.Cordova.Commands
{
    /// <summary>
    ///     Provides the ability to play audio files in the background for Windows phone
    /// </summary>
    public class BackgroundAudio : BaseCommand
    {
        // AudioPlayer messages
        private const int MediaState = 1;
        private const int MediaDuration = 2;
        private const int MediaPosition = 3;
        private const int MediaError = 9;

        // AudioPlayer errors
        private const int MediaErrorPlayModeSet = 1;
        private const int MediaErrorAlreadyRecording = 2;
        private const int MediaErrorStartingRecording = 3;
        private const int MediaErrorRecordModeSet = 4;
        private const int MediaErrorStartingPlayback = 5;
        private const int MediaErrorResumeState = 6;
        private const int MediaErrorPauseState = 7;
        private const int MediaErrorStopState = 8;

        private AudioTrack _audioTrack;
        private bool _durationSent;

        public void Play(string options)
        {
            string callbackId = CurrentCommandCallbackId;

            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                try
                {
                    var optionsString = JsonHelper.Deserialize<string[]>(options);
                    var trackInfo = JsonHelper.Deserialize<string[]>(optionsString[1]);
                    string url = trackInfo[0];

                    _audioTrack = new AudioTrack(
                        new Uri(url, UriKind.Absolute),
                        trackInfo[1], //title
                        trackInfo[2], //artist
                        "Windows Phone Radio", //album
                        null); //controls

                    _durationSent = false;
                    BackgroundAudioPlayer.Instance.Track = _audioTrack;
                    BackgroundAudioPlayer.Instance.Play();
                    DispatchCommandResult(new PluginResult(PluginResult.Status.OK), callbackId);
                }
                catch (Exception e)
                {
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, e.Message), callbackId);
                }
            });
        }

        public void PauseResume(string options)
        {
            string callbackId = CurrentCommandCallbackId;

            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                try
                {
                    if (BackgroundAudioPlayer.Instance.PlayerState == PlayState.Playing)
                    {
                        BackgroundAudioPlayer.Instance.Pause();
                    }
                    else if (BackgroundAudioPlayer.Instance.PlayerState == PlayState.Paused)
                    {
                        if (BackgroundAudioPlayer.Instance.Track != null)
                        {
                            if (
                                Math.Abs(BackgroundAudioPlayer.Instance.Position.TotalSeconds -
                                         BackgroundAudioPlayer.Instance.Track.Duration.TotalSeconds) < 1.0)
                            {
                                BackgroundAudioPlayer.Instance.Position = new TimeSpan(0, 0, 0);
                            }
                            BackgroundAudioPlayer.Instance.Play();
                        }
                    }
                    else if (BackgroundAudioPlayer.Instance.PlayerState == PlayState.Unknown)
                    {
                        if (_audioTrack != null)
                        {
                            BackgroundAudioPlayer.Instance.Track = _audioTrack;
                            BackgroundAudioPlayer.Instance.Play();
                        }
                    }
                    DispatchCommandResult(new PluginResult(PluginResult.Status.OK), callbackId);
                }
                catch (Exception e)
                {
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, e.Message), callbackId);
                }
            });
        }

        public void GetCurrentPosition(string options)
        {
            string callbackId = CurrentCommandCallbackId;

            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                try
                {
                    DispatchCommandResult(
                        new PluginResult(PluginResult.Status.OK,
                            BackgroundAudioPlayer.Instance.Position.TotalSeconds), callbackId);
                }
                catch (Exception e)
                {
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, e.Message), callbackId);
                }
            });
        }

        public void Seek(string options)
        {
            string callbackId = CurrentCommandCallbackId;

            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                try
                {
                    var optionsString = JsonHelper.Deserialize<string[]>(options);

                    if (BackgroundAudioPlayer.Instance.CanSeek)
                    {
                        int change = int.Parse(optionsString[1]);
                        double pos = BackgroundAudioPlayer.Instance.Position.TotalSeconds;

                        if ((pos + change >= 0) &&
                            (pos + change < BackgroundAudioPlayer.Instance.Track.Duration.TotalSeconds))
                        {
                            var ts = new TimeSpan(0, 0, change);
                            BackgroundAudioPlayer.Instance.Position += ts;
                        }
                        else
                            BackgroundAudioPlayer.Instance.Position = new TimeSpan();
                    }
                    DispatchCommandResult(new PluginResult(PluginResult.Status.OK), callbackId);
                }
                catch (Exception e)
                {
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, e.Message), callbackId);
                }
            });
        }

        public void Create(string options)
        {
            string callbackId = CurrentCommandCallbackId;

            Deployment.Current.Dispatcher.BeginInvoke(() =>
            {
                try
                {
                    BackgroundAudioPlayer.Instance.PlayStateChanged += Instance_PlayStateChanged;
                    DispatchCommandResult(new PluginResult(PluginResult.Status.OK), callbackId);
                }
                catch (Exception e)
                {
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, e.Message), callbackId);
                }
            });
        }

        private void Instance_PlayStateChanged(object sender, EventArgs e)
        {
            AudioTrack track = BackgroundAudioPlayer.Instance.Track;
            switch (BackgroundAudioPlayer.Instance.PlayerState)
            {
                case PlayState.Playing:
                    if (_durationSent == false &&
                        track != null &&
                        track.Duration.TotalSeconds > 0)
                    {
                        InvokeCallback(MediaDuration,
                            BackgroundAudioPlayer.Instance.Track.Duration.TotalSeconds.ToString(
                                CultureInfo.InvariantCulture));
                        _durationSent = true;
                    }
                    break;

                case PlayState.Paused:
                    break;

                case PlayState.Stopped:
                    break;

                case PlayState.Unknown:
                    break;

                case PlayState.Error:
                    InvokeCallback(MediaError, MediaErrorStopState.ToString(CultureInfo.InvariantCulture));
                    break;
            }
        }

        private void InvokeCallback(int message, string value)
        {
            const string id = null; //reserved
            string args = string.Format("('{0}',{1},{2});", id, message, value);
            string callback = @"(function(id,msg,value){
                try {
                    if (msg == BackgroundAudio.MEDIA_ERROR) {
                        value = {'code':value};
                    }
                    BackgroundAudio.onStatus(id,msg,value);
                }
                catch(e) {
                    console.log('Error calling Media.onStatus :: ' + e);
                }
            })" + args;
            InvokeCustomScript(new ScriptCallback("eval", new[] {callback}), false);
        }
    }
}