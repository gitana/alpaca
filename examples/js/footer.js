$(function() {
    $("footer .container_12").prepend('<div class="actual-body"><div class="grid_6"><h4>Alpaca Twitter Feed</h4><div class="tweet alpacajs-tweet"></div></div><div class="grid_6"><h4>Cloud CMS Twitter Feed</h4><div class="tweet cloudcms-tweet"></div></div></div>');
    $(".alpacajs-tweet").tweet({
        username: "alpacajs",
        join_text: "auto",
        avatar_size: 32,
        count: 3,
        auto_join_text_default: " we said,",
        auto_join_text_ed: " we",
        auto_join_text_ing: " we were",
        auto_join_text_reply: " we replied to",
        auto_join_text_url: " we were checking out",
        loading_text: "loading tweets..."
    });
    $(".cloudcms-tweet").tweet({
        username: "cloudcms",
        join_text: "auto",
        avatar_size: 32,
        count: 3,
        auto_join_text_default: " we said,",
        auto_join_text_ed: " we",
        auto_join_text_ing: " we were",
        auto_join_text_reply: " we replied to",
        auto_join_text_url: " we were checking out",
        loading_text: "loading tweets..."
    });

    $("body").append('<a href="https://github.com/gitana/alpaca"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_left_red_aa0000.png" alt="Fork me on GitHub"></a>');

});