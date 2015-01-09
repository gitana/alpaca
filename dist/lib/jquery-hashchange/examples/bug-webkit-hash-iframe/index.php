<?PHP

include "../index.php";

$shell['title3'] = "Bug in WebKit: Back Button in an Iframe";

$shell['h2'] = 'Wanna see a strange issue in WebKit?';

// ========================================================================== //
// SUBHEADER
// ========================================================================== //

ob_start();
?>
  <a href="http://benalman.com/news/2009/12/webkit-bug-hash-history-iframe/">Read more about the issue here!</a>
<?
$shell['h3'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// HTML HEAD ADDITIONAL
// ========================================================================== //

ob_start();
?>
<script type="text/javascript" language="javascript">

top.setHeight = function( h ) {
  return $('iframe').height( h ).length;
};

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

iframe {
  border: 1px solid #000;
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
  First, open this page in a brand new window (right click <a href="./">this link</a>,
  and select "open link in new window" if necessary) so that there is no browser
  history, and the back button is disabled (if the back button is clickable,
  it will complicate the example).
</p>

<p><em>Tested in Safari Version 4.0.4 (5531.21.10) / Chrome 3.0.195.33 / WebKit nightly r51669.
Submitted to WebKit Bugzilla as <a href="https://bugs.webkit.org/show_bug.cgi?id=32156">Bug 32156</a>.</em></p>

<h3>The Iframe</h3>

<div id="iframe" class="clear">
  <iframe src="./child/#begin" width="700" height="400" scrolling="no" frameborder="0"></iframe>
</div>

<?
$shell['html_body'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// DRAW SHELL
// ========================================================================== //

draw_shell();

?>
