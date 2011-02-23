$(function() {
	function addThemeSwitcher(container, position) {
		var pos = {
			top: '10px',
			right: '10px',
			zIndex: 10
		};
		$('<div id="themeContainer" style="position: absolute; overflow-x: hidden;"></div>').css($.extend(pos, position)).appendTo(container || 'body').themeswitcher();
	};
	
	$.each($("div[id^='field'],table[id^='field']"), function() {
		var currentId = $(this).attr('id');
		
		$(this).after('<span><small><button id="' + currentId + '-code-button">Source Code</button></small></span><pre id="' + currentId + '-pre" style="margin: -15px 0px 0px 5px;"><code id="' + currentId + '-code" style="margin: 15px 0px 0px 5px;"></code></pre>').after('<div class="alpaca-clear"></div>');
		$('#' + currentId + '-pre').hide();
		$('#' + currentId + '-code-button').button({
			icons: {
				primary: "ui-icon-circle-arrow-e"
			}
		}).click(function() {
			$('#' + currentId + '-code').html($('#' + currentId + '-script').html().trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
			$('#' + currentId + '-pre').toggle();
			$('.ui-icon', this).toggleClass("ui-icon-circle-arrow-e").toggleClass("ui-icon-circle-arrow-s");
		});
	});
	
	var currentExampleId = $('.alpaca-example-header').attr('id');
	var exampleListDS = '../examples.json';
		
	addThemeSwitcher($('.alpaca-example-header'), {
		top: '26px',
		right: '20px'
	});
	
	function _renderSideBar(container, items, isTopLevel) {
		var bar;
		if (isTopLevel) {
			bar = $('<ul></ul>');
		} else {
			bar = $('<ul>' + items.title + '</span></ul>');			
		}	
		$.each(items.examples, function(i, item) {
			var itemBar = $('<li></li>');
			if (item.examples) {
				_renderSideBar(itemBar, item);
			} else {
				var listItem = $('<span><span class="ui-icon ui-icon-play" style="float:left"></span><a href="'+item.link+'">'+item.title+'</a></span>');
				itemBar.append(listItem);
				if (item.id == currentExampleId) {
					itemBar.addClass('ui-state-highlight');
				}
				itemBar.hover(function(){
					$(this).addClass('ui-state-hover');
				}, function(){
					$(this).removeClass('ui-state-hover');
				});
			}
			itemBar.appendTo(bar);
		});
		bar.appendTo(container);
	};
		
	$.ajax({
		url: exampleListDS,
		type: "get",
		dataType: "json",
		success: function(jsonDocument) {
			var sideBar = $('<div class="alpaca-example-sidebar ui-widget ui-widget-content ui-corner-all"></div>');
			_renderSideBar(sideBar,jsonDocument,true);
			$('h2:first',sideBar).addClass('ui-widget-header');
			sideBar.prepend('<div class="alpaca-example-sidebar-header ui-widget ui-widget-content ui-widget-header ui-corner-top">'+jsonDocument.title+'</div>');
			$('.alpaca-example-body').prepend(sideBar).prepend('<div style="clear:both"></div>');
		},
		error: function(error) {
			//alert('failed to get example list');
		}
	});
});
