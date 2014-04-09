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

    var reload = function()
    {
        $("#field1").empty();

        var time1 = new Date().getTime();
        $("#field1").alpaca({
            "view": "VIEW_BOOTSTRAP_CREATE",
            "optionsSource": "./options/visit.json",
            "schemaSource": "./schema/visit.json",
            "postRender": function(renderedField) {

                var time2 = new Date().getTime();

                console.log("Render took: " + (time2 - time1) + " ms");

                // COUNTER: "render" (text = 3.84)
                console.log("Counter: render");
                showCounters(Alpaca.Counters("render"));

                // COUNTER: "tmpl" (text = 2.07)
                console.log("Counter: tmpl");
                showCounters(Alpaca.Counters("tmpl"));

                // remaining = 1.77
            }
        });
    };

    $("#run").click(function(e) {
        reload();
    })

});
