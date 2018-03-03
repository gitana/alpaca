<?PHP

include "../index.php";

$shell['title3'] = "document.domain";

$shell['h2'] = 'The hash, it\'s a-changin\'...';

// ========================================================================== //
// SCRIPT
// ========================================================================== //

ob_start();
?>
$(function(){
  
  // These two properties, set after jQuery and the hashchange event plugin are
  // loaded, only need to be used when document.domain is set (to fix the "access
  // denied" error in IE6/7).
  $.fn.hashchange.src = '../../document-domain.html';
  $.fn.hashchange.domain = document.domain;
  
  // Bind an event to window.onhashchange that, when the hash changes, gets the
  // hash and adds the class "selected" to any matching nav link.
  $(window).hashchange( function(){
    var hash = location.hash;
    
    // Set the page title based on the hash.
    document.title = 'The hash is ' + ( hash.replace( /^#/, '' ) || 'blank' ) + '.';
    
    // Iterate over all nav links, setting the "selected" class as-appropriate.
    $('#nav a').each(function(){
      var that = $(this);
      that[ that.attr( 'href' ) === hash ? 'addClass' : 'removeClass' ]( 'selected' );
    });
  })
  
  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).hashchange();
  
});
<?
$shell['script'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// HTML HEAD ADDITIONAL
// ========================================================================== //

ob_start();
?>
<script type="text/javascript">
  // If setting document.domain, be sure to do it *before* jQuery is loaded!
  document.domain = document.domain.split('.').slice(-2).join('.');
</script>
<?
$shell['html_head_pre'] = ob_get_contents();
ob_end_clean();

ob_start();
?>
<script type="text/javascript" src="../../jquery.ba-hashchange.js"></script>
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

#nav {
  font-size: 200%;
}

#nav a {
  color: #777;
  border: 2px solid #777;
  background-color: #ccc;
  padding: 0.2em 0.6em;
  text-decoration: none;
  float: left;
  margin-right: 0.3em;
}

#nav a:hover {
  color: #999;
  border-color: #999;
  background: #eee; 
}

#nav a.selected,
#nav a.selected:hover {
  color: #0a0;
  border-color: #0a0;
  background: #afa; 
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
  <a href="http://benalman.com/projects/jquery-hashchange-plugin/">jQuery hashchange event</a> enables very basic bookmarkable #hash history via a cross-browser window.onhashchange event. <em>This example is exactly like the basic <a href="../hashchange/">hashchange event example</a> except that document.domain is set, and the example code has been modifed accordingly.</em>
</p>

<h3>Click, and watch as the magic happens!</h3>

<p id="nav">
  <a href="#test1">test 1</a>
  <a href="#test2">test 2</a>
  <a href="#test3">test 3</a>
  <a href="#test4">test 4</a>
</p>

<div class="clear" style="padding-top:1em;"></div>

<p>
  Note that there is absolutely no JavaScript attached to the click event of these links. All they do is set the <code>location.hash</code> via href, and the callback bound to the window.onhashchange event does the rest. Once you've clicked one or more of these links, fool around with your browser's back and next buttons.
</p>

<h3>The code</h3>

<pre class="brush:js">
<?= htmlspecialchars( $shell['script'] ); ?>
</pre>

<h3>That's it!</h3>

<p>
  This plugin is, by design, very basic. If you want to add lot of extra utility around getting and setting the hash as a state, and parsing and merging fragment params, check out the <a href="http://benalman.com/projects/jquery-bbq-plugin/">jQuery BBQ</a> plugin. It includes this plugin at its core, plus a whole lot more, and has thorough documentation and examples as well. You can't have too much of a good thing!
</p>

<?
$shell['html_body'] = ob_get_contents();
ob_end_clean();

// ========================================================================== //
// DRAW SHELL
// ========================================================================== //

draw_shell();

?>