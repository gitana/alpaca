$(function(){
    $.each($("div[id^='field']"), function(){
        var currentId = $(this).attr('id');
        $(this).after('<div id="'+currentId+'-code-button" class="code-button"><b>>></b>  Source Code</div><pre id="' + currentId + '-pre"><code id="' + currentId + '-code"></code></pre>');
        $('#' + currentId + '-code').html($('#' + currentId + '-script').html().trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    	$('#'+currentId + '-pre').hide();
		$('#'+currentId + '-code-button').click(function () {
			$(this).children("b").toggleClass("code-button-collapsed");
			$('#'+currentId + '-pre').toggle();
		});
		$(this).addClass("alpaca-test-case");
		$(this).after("<div class='clear'></div>");
	});
});
