$(function(){
    $.each($("div[id^='field']"), function(){
        var currentId = $(this).attr('id');
        $(this).after('<div id="'+currentId+'-code-button" class="code-button"><a href="#">Source Code</a></div><pre id="' + currentId + '-pre"><code id="' + currentId + '-code"></code></pre>');
        $('#' + currentId + '-code').html($('#' + currentId + '-script').html().trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    	$('#'+currentId + '-pre').hide();
		$('#'+currentId + '-code-button').click(function () {
			$('#'+currentId + '-pre').toggle();
		})
	});
});
