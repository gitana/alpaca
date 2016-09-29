<?PHP

include "../index.php";

$shell['title3'] = "Bug in Firefox: Remote XMLHttpRequest";

$shell['h2'] = 'Wanna see a strange issue in Firefox?';

// ========================================================================== //
// SUBHEADER
// ========================================================================== //

ob_start();
?>
  <a href="http://benalman.com/news/2009/11/is-this-a-firefox-remote-xhr-bug/">Read more about the issue here!</a>
<?
$shell['h3'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// SCRIPT
// ========================================================================== //

ob_start();
?>

$(function(){
  
  // Set the hash the "usual" way.
  function callback_hash( idx ) {
    debug.log( idx );
    window.location.hash = '#done_' + idx;
  };
  
  // Set the hash by re-setting the entire URL.
  function callback_href( idx ) {
    debug.log( idx );
    window.location.href = window.location.href.replace( /#.*$/, '' ) + '#done_' + idx;
  };
  
  // Set the hash by re-setting the entire URL.. asynchronously.
  function callback_href_kluge( idx ) {
    setTimeout(function(){
      callback_href( idx );
    }, 0);
  };
  
  var arr = [
    
    // 1
    [
      'JSON request, callback sets hash via location.hash',
      {
        url: '../../shared/json_echo.php?a=1',
        success: function(){ callback_hash(1); }
      }
    ],
    
    // 2
    [
      'JSONP request, callback sets hash via location.hash',
      {
        url: 'http://api.flickr.com/services/feeds/photos_public.gne?id=8395214@N06&format=json',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(){ callback_hash(2); }
      }
    ],
    
    // 3
    [
      'JSON request, callback sets hash via location.href',
      {
        url: '../../shared/json_echo.php?a=1',
        success: function(){ callback_href(3); }
      }
    ],
    
    // 4
    [
      'JSONP request, callback sets hash via location.href <i>(FAILS IN FIREFOX)</i>',
      {
        url: 'http://api.flickr.com/services/feeds/photos_public.gne?id=8395214@N06&format=json',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(){ callback_href(4); }
      }
    ],
    
    // 5
    [
      'JSON request, callback sets hash via location.href, setTimeout kluge used',
      {
        url: '../../shared/json_echo.php?a=1',
        success: function(){ callback_href_kluge(5); }
      }
    ],
    
    // 6
    [
      'JSONP request, callback sets hash via location.href, setTimeout kluge used',
      {
        url: 'http://api.flickr.com/services/feeds/photos_public.gne?id=8395214@N06&format=json',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(){ callback_href_kluge(6); }
      }
    ]
  ];
  
  $.each( arr, function(i,v){
    var idx = i + 1,
      html = '<p><b>' + v[0] + '<\/b><\/p>'
        + 'Click <a href="#">this link<\/a>.'
        + ' The hash should immediately change to "start_' + idx + '", then "done_' + idx + '"'
        + ' once the callback completes. Once done, press the back button once to see'
        + ' "start_' + idx + '", and again to see an empty hash.';
    
    $('<li/>')
      .html( html )
      .appendTo( '#nav' )
      .find( 'a' )
        .click(function(){
          window.location.hash = '#start_' + idx;
          $.ajax( $.extend({}, v[1]) );
          return false;
        });
  });
  
});
<?
$shell['script'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// HTML HEAD ADDITIONAL
// ========================================================================== //

ob_start();
?>
<script type="text/javascript" language="javascript">

<?= $shell['script']; ?>

$(function(){
  
  // Syntax highlighter.
  SyntaxHighlighter.highlight();
  
});

</script>
<style type="text/css" title="text/css">

/*
bg: #FDEBDC
bg1: #FFD6AF
bg2: #FFAB59
orange: #FF7F00
brown: #913D00
lt. brown: #C4884F
*/

#page {
  width: 700px;
}

ol li {
  padding-bottom: 1.2em;
}

ol li p {
  margin-bottom: 0.2em;
}

ol li i {
  color: #f00;
}

</style>
<?
$shell['html_head'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// HTML BODY
// ========================================================================== //

ob_start();
?>
<?= $shell['donate'] ?>

<p>
  First, open this page in a new window or tab, to clear any current window or tab history. Make your window wide enough so that you can see the full URL in the address bar, with some extra space left over.
</p>

<p>
  Each link below, when clicked, should immediately change the location hash to "start_N" (where N is the index). Once the associated callback completes, the hash will be changed to "done_N". At this point, you should be able to press the browser "back" button once to see the "start_N" hash, and then a second time to see a completely empty hash.
</p>

<p>
  Notice how #4 fails in Firefox! All six tests work in IE 8, Opera, Safari and Chrome (of course, Chrome is succeptible to <a href="../bug-chrome-back-button/">a totally separate history bug</a>), but this question remains: <strong>is this intentional Firefox behavior, or a bug?</strong>
</p>

<ol id="nav"></ol>

<h3>The code</h3>

<pre class="brush:js">
<?= htmlspecialchars( $shell['script'] ); ?>
</pre>

<?
$shell['html_body'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// DRAW SHELL
// ========================================================================== //

draw_shell();

?>