<?PHP

include "../../index.php";
$base = '../../';

$shell['title3'] = "Bug in WebKit: Back Button in an Iframe";

$shell['h2'] = 'Wanna see a strange issue in WebKit?';

// ========================================================================== //
// SCRIPT
// ========================================================================== //

ob_start();
?>
$(function(){
  
  // Show the current location.hash.
  setInterval(function(){ $('#status').text( location.hash ); }, 100);
  
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
  
  // Oops?
  if ( window == top ) {
    $('h2').show();
  }
  
  // Set the Iframe height.
  var if_height;
  
  (function loopy(){
    
    var h = $('body').outerHeight( true );
    
    h !== if_height && top.setHeight && top.setHeight( h ) && ( if_height = h );
    
    setTimeout( loopy, 500 );
    
  })();
  
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
  width: auto;
}

#header, #footer {
  display: none;
}

html, body {
  background: #eee;
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
<h2 style="display:none">This page is part of a full example. If you didn't see a "step 1", <a href="../">click here to reset!</a></h2>

<p>
  <span class="step">2</span>
  Click these links to change the Iframe location.hash:
  <a href="#middle">#middle</a> and 
  <a href="#end">#end</a>.
</p>
<p>
  <em>The location.hash should go from #begin → #middle → #end as you click the
  links above.</em>
</p>

<p><strong>The current Iframe location.hash is: <span id="status"></span></strong></p>

<p>
  Now, in most modern browsers (not IE6 or 7), in an Iframe or not, each hash change
  creates a new history entry, so that the back button becomes enabled and you
  can press it to return to a previous entry.
</p>

<p>
  <span class="step">3</span>
  After clicking #middle and #end, press the back button twice.
</p>
<p>
  <em>The location.hash should go from #end → #middle → #begin as you press the
  back button</em>
</p>

<p>
  When the #middle or #end links are clicked, and the location.hash is changed, the back button
  should be enabled. In Firefox, IE8 and Opera this works as expected. In Safari and
  Chrome, in an Iframe, the back button stays disabled.. and in the latest WebKit
  nightly (r51669), the back button is enabled, but only partially.
</p>
<p>
  For whatever reason, when the location.hash is changed inside an Iframe in Safari
  or Chrome, no new history entries are created (and the back button stays disabled).
  In the latest WebKit nightly, new history entries are created, but not for the initial
  location.hash. Meaning you can go back, but never to #begin.
</p>

<p>
  <span class="step">4</span>
  <a href="./#begin" target="_top">Click here</a> to load this page in the "top" and
  you'll see that everything works as-expected. Repeat steps 2 and 3 there, and you'll
  see that the location.hash goes from #begin → #middle → #end → #middle → #begin. When
  you're done, press the back button again to return to the "in an Iframe" page.
</p>

<p>
  <span class="step">5</span>
  Now that you've returned to the "in an Iframe" page, repeat steps 2 and 3 a final time..
  and see that the history now works! Well, almost works, because you still can't
  get to the initial #begin location.hash in Safari, Chrome, or the WebKit nightly.
</p>

<p>What's up with that, WebKit?</p>

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
