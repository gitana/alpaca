$(function() {
    $("footer .container_12").prepend('<div class="actual-body"><div class="grid_6"><h4>Alpaca Twitter Feed</h4><div class="tweet alpacajs-tweet"></div></div><div class="grid_6"><h4>Cloud CMS Twitter Feed</h4><div class="tweet cloudcms-tweet"></div></div></div>');

    // load tweets
    var loadTweets = function(username, domSelector, callback)
    {
        jQuery.ajax({
            url: "https://www.cloudcms.com/feeds/twitter/user?total=3&user=" + username,
            cache: false,
            dataType: "json",
            success: function(value) {

                postProcessTweets(value, domSelector);

                if (callback)
                {
                    callback();
                }
            }
        });
    };

    var postProcessTweets = function(data, domSelector)
    {
        var count = 0;
        while (count < data.statuses.length)
        {
            var status = data.statuses[count];
            var html = status["html"];
            var imageUrl = status["imageUrl"];
            var intro = status["intro"];
            var userName = status["userName"];

            var divHtml = jQuery("<div><p style='color: #6984AB;'><img style='float:left; padding: 5px' src='" + imageUrl + "'><span style='color: white'>" + intro + userName + " wrote:</span> " + html + "</p></div>");

            var html = "";
            html += "<div class='footer_post tweet_post'>";
            html += divHtml.html();
            html += "</div>";
            html += "<div style='clear:both'></div>";

            jQuery(domSelector).append(html);

            count++;
        }
    };

    $("body").append('<a href="https://github.com/gitana/alpaca"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_left_red_aa0000.png" alt="Fork me on GitHub"></a>');

    loadTweets("cloudcms", ".cloudcms-tweet", function() {
        loadTweets("alpacajs", ".alpacajs-tweet", function() {
            // done
        });
    });

});