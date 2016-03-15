<?PHP

include "../index.php";

$shell['title3'] = "Bug in Safari: Back Button from a different domain";

$shell['h2'] = "Here's a really strange bug in Safari...";

// ========================================================================== //
// SUBHEADER
// ========================================================================== //

ob_start();
?>
  <!--<a href="http://benalman.com/news/2009/11/is-this-a-firefox-remote-xhr-bug/">Read more about the issue here!</a>-->
<?
$shell['h3'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// SCRIPT
// ========================================================================== //

ob_start();
?>

(function(window){
  
  // A convenient shortcut.
  var win_loc = window.location,
    loc = location,
    state;
  
  (function loopy(){
    console.log([
      'win_loc.href: ' + typeof win_loc.href,
      'loc.href: ' + typeof loc.href,
      'location.href: ' + typeof location.href,
      'window.location.href: ' + typeof window.location.href
    ].join(', '));
    timeout_id = setTimeout( loopy, 1000 );
  })();
  
})(this);

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

.step {
  color: #fff;
  background: #0a0;
  border: 1px solid #070;
  padding: 0 0.4em;
  font-weight: 700;
  -moz-border-radius: 8px;
  -webkit-border-radius: 8px;
  border-radius: 8px;
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
  <span class="step">1</span>
  Open this page in Safari 4.
</p>

<p>
  <span class="step">2</span>
  Open the debugging Error Console (cmd-opt-C)
</p>

<p>
  <span class="step">3</span>
  Notice that <code>win_loc.href: string, loc.href: string, location.href: string, window.location.href: string</code> is getting printed to the console.
  This is expected.
</p>

<p>
  <span class="step">4</span>
  Navigate to a page on a different domain, like <a href="http://google.com/">Google</a> or <a href="http://github.com/">GitHub</a>.
</p>

<p>
  <span class="step">5</span>
  Press the back button.
</p>

<p>
  <span class="step">6</span>
  Notice that <code>win_loc.href: undefined, loc.href: undefined, location.href: string, window.location.href: string</code> is getting printed to the console.
  What's up with those <code>undefined</code>, Safari?
</p>

<p><em>Tested in Safari Version 4.0.4 (5531.21.10) / WebKit nightly r54415.
  Submitted to WebKit Bugzilla as <a href="https://bugs.webkit.org/show_bug.cgi?id=34679">Bug 34679</a>.</em></p>

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