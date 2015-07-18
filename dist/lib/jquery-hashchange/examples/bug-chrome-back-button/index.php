<?PHP

include "../index.php";

$shell['title3'] = "Bug in Chrome: Back Button";

$shell['h2'] = 'Wanna see a strange issue in Chrome?';

// ========================================================================== //
// SUBHEADER
// ========================================================================== //

ob_start();
?>
  <a href="http://benalman.com/news/2009/09/chrome-browser-history-buggine/">Read more about the issue here!</a>
<?
$shell['h3'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// SCRIPT
// ========================================================================== //

ob_start();
?>

var delay = 250;

// Set the browser title.
function set_title( i ) {
  document.title = document.title.replace( /\s*\d*$/, '' ) + ' ' + i;
}

// Add new history entries by changing window.location.hash, in an
// asynchronous loop.
function add_history_entries( start, end ) {
  (function loopy(){
    window.location.hash = '#' + start;
    set_title( start );
    ++start <= end && setTimeout( loopy, delay );
  })();
};

// Go back in the history, in an asynchronous loop.
function go_back( i ) {
  (function loopy(){
    window.history.go(-1);
    --i && setTimeout( loopy, delay );
  })();
};

// Some window.onhashchange stuff. Not really important here.
function handler() {
  var i = window.location.hash.replace( /^#/, '' );
  set_title( i );
};

if ( window.addEventListener ) {
  window.addEventListener( 'hashchange', handler, false );
} else if ( window.attachEvent ) {
  window.attachEvent( 'onhashchange', handler );
}

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

<p>First, open this page in a new window or tab, to clear any current window or tab history. Make your window wide enough so that you can see the full URL in the address bar, with some extra space left over.</p>

<p>
<a href="#" onclick="add_history_entries(1,10); return false;">Add ten history entries</a>
</p>

<ul>
  <li>Hash should change from #1 .. #10, once every 250ms.</li>
  <li>Browser title should change from "Back Button Test 1" .. "Back Button Test 10" at the same time.</li>
  <li>Ten new history entries should be added.</li>
  <li>Verify that pages "Back Button Test 0" .. "Back Button Test 9" are now in the history.</li>
</ul>

<p>
<a href="#" onclick="go_back(10); return false;">Go back 10 times</a>
</p>

<ul>
  <li>Hash should change from #10 .. #1 then disappear.</li>
  <li>Browser title should only change from "Back Button Test 10" .. "Back Button Test 1" if window.onhashchange is supported.</li>
  <li>History entries "Back Button Test 9" .. "Back Button Test 0" should be removed.</li>
</ul>

<h3>Notes</h3>

<ul>
  <li>No new history entries are added in IE6/7, so there's nothing to "go back" to.</li>
  <li>Only IE8 and FF 3.6 support window.onhashchange.</li>
  <li>Chrome 3 / Chromium randomly "loses" history entries. <a href="http://code.google.com/p/chromium/issues/detail?id=1016">Chromium issue 1016</a></li>
</ul>

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