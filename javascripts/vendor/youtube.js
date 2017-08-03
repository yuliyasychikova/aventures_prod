window.YouTube = (function($, window, document) {
    window.disableScroll = function(){
          $('body').addClass('noscroll');
    };

    window.enableScroll = function(){
        if (!$('.modal-container:visible').length){
            $('body').removeClass('noscroll');
        }
    };

    var $ytVideo = $(".yt-video").on('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $('#bg-video').get(0).pause()

        showVideo($(this).data('id'), function() {

        });
    });

    // attach our YT listener once the API is loaded
    function _initVideo(id, videoId, callback) {
        window.onYouTubeIframeAPIReady = function() {
            window.player = new YT.Player(id, {
                height: '315',
                width: '560',
                videoId: videoId,
                playerVars: {
                    modestbranding: 0,
                    rel: 0,
                    feature: 'player_detailpage',
                    wmode: 'transparent',
                    iv_load_policy: 3,
                    showinfo: 0,
                    autohide: 1
                },
                events: {
                    onStateChange: function(e){
                        if (e["data"] == YT.PlayerState.PLAYING && YT.gtmLastAction == "play") {
                            callback();

                            YT.gtmLastAction = "";
                        }
                    },
                    onReady: function() {
                      window.player.playVideo();
                    }
                }
            });

            $(window).trigger('scroll');
            YT.gtmLastAction = "play";
        };

        _loadYoutubeIfNotLoadedYet();
    }

    function _loadYoutubeIfNotLoadedYet() {
        if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
            // load the Youtube JS api and get going
            var tag = document.createElement('script');
            tag.src = "//www.youtube.com/player_api";
            tag.async = true;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            window.onYouTubeIframeAPIReady();
        }
    }

    function _showVideoPopup() {
        var $popup = $('#video-popup');

        disableScroll();

        $popup.fadeIn('fast', function(){
            $(window).trigger('modalShow');
        }).find('.close').on('click', function(e){
            e.preventDefault();

            $('#bg-video').get(0).play()

            $popup.fadeOut(function(){
                window.player.destroy();
                enableScroll();

                $popup.find('.close').off('click');
            });
        })
    }

    function showVideo(id, callback) {
        _showVideoPopup();
        _initVideo('popup-player', id, function(){
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    return {
        showVideo: showVideo
    }
})(jQuery, window, document);
