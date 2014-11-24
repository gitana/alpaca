var showCounters = function(counters)
{
    counters.each(function(type, counter) {
        console.log("Type: " + type + ", count: " + counter.count + ", total: " + counter.total + ", avg: " + counter.avg);
    });
    console.log("All count: " + counters.all().count);
    console.log("All total: " + counters.all().total);
    console.log("All avg: " + counters.all().avg);
    console.log("");
};

$(document).ready(function() {

    Alpaca.collectTiming = true;

    var MAX = 100;

    var reload = function(callback)
    {
        var f = function(count)
        {
            if (count == MAX)
            {
                // done
                callback();
                return;
            }

            $("#field1").empty();

            $("#field1").alpaca({
                "view": "VIEW_BOOTSTRAP_CREATE",
                "schema": {
                    "type": "string"
                },
                "options": {
                    "label": "Title"
                },
                "postRender": function(renderedField) {

                    f(count+1);
                }
            });
        };

        f(0);
    };

    $("#run").click(function(e) {

        var time1 = new Date().getTime();
        reload(function() {

            var time2 = new Date().getTime();

            console.log("Render took: " + (time2 - time1) + " ms");

            console.log("Counter: render");
            showCounters(Alpaca.Counters("render"));

            console.log("Counter: tmpl");
            showCounters(Alpaca.Counters("tmpl"));
        });
    })

});
