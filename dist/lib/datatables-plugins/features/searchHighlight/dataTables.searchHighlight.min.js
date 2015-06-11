/*!
 SearchHighlight for DataTables v1.0.1
 2014 SpryMedia Ltd - datatables.net/license
*/
(function(g,d,a){function e(a,c){a.unhighlight();c.rows({filter:"applied"}).data().length&&a.highlight(c.search().split(" "))}a(d).on("init.dt.dth",function(d,c){var b=new a.fn.dataTable.Api(c),f=a(b.table().body());if(a(b.table().node()).hasClass("searchHighlight")||c.oInit.searchHighlight||a.fn.dataTable.defaults.searchHighlight)b.on("draw.dt.dth column-visibility.dt.dth column-reorder.dt.dth",function(){e(f,b)}).on("destroy",function(){b.off("draw.dt.dth column-visibility.dt.dth column-reorder.dt.dth")}),
b.search()&&e(f,b)})})(window,document,jQuery);
