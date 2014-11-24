$( document ).ready(function() {

    /* Sidebar height set */
    $('.sidebar').css('min-height',$(document).height());

    /* Secondary contact links */
    var scontacts = $('#contact-list-secondary');
    var contact_list = $('#contact-list');

    scontacts.hide();

    contact_list.mouseenter(function(){ scontacts.slideDown(); });

    contact_list.mouseleave(function(){ scontacts.slideUp(); });

    // alpaca discussions
    var DISCUSSIONS_HTML = '<div> \
            <br/> \
            <br/> \
            <div id="disqus_thread"></div> \
            <script type="text/javascript"> \
                var disqus_shortname = "alpacajs"; \
                (function() { \
                    var dsq = document.createElement("script"); dsq.type = "text/javascript"; dsq.async = true; \
                    dsq.src = "//" + disqus_shortname + ".disqus.com/embed.js"; \
                    (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq); \
                })(); \
            </script> \
            <noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript> \
            <a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a> \
        </div>';

    $(".alpaca-discussions").append(DISCUSSIONS_HTML);

    // do some pretty print
    if (window.prettyPrint)
    {
        window.prettyPrint();
    }

});


