$(document).ready(docMain);

var conf = new Object();
var controlVisible = true;

function docMain() {
    redraw();
    $(document).keypress(kpress);
}

function kpress(e) {
    if (e.which == 104) { // 'h'
        if (controlVisible) {
            controlVisible = false;
            $("div.control").hide();
        } else {
            controlVisible = true;
            $("div.control").show();
        }
    }
}

function redraw() {
    drawFatTree();
}

function drawFatTree() {
    // Based on the report
    // 256 Spine blocks
    // 64 groups of 8 Aggregation blocks
    // 32 ToR per Aggregation group
    // Didnt say how many machines per ToR block
    // var number_of_spine_blocks_per_group = 258
    // var number_of_spine_groups = 1
    // var number_of_aggregation_blocks_per_group = 8
    // var number_of_aggregation_groups = 64
    // var number_of_ToR_blocks_per_group = 32
    // var number_of_ToR_groups = 64

    // Cant visualize, the lines are just a block of grey
    // Instead we just show a smaller amount
    var number_of_spine_blocks_per_group = 16
    var number_of_spine_groups = 1
    var number_of_aggregation_blocks_per_group = 8
    var number_of_aggregation_groups = 4
    var number_of_ToR_blocks_per_group = 32
    var number_of_ToR_groups = 4
    var padg = 13;
    var padi = 12;
    var hline = 70;
    var hhost = 50;

    var podw = 8;
    var podh = 8;
    var hostr = 2;

    d3.select("svg.main").remove();

    // Uncomment for full graph
    // var w = 8000;
    var w = 2000;
    var h = 400;

    var svg = d3.select("#canvas-container").append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "main")
        .append("g")
        .attr("transform", "translate(" + w/2 + "," + h/2 + ")");

    var linePositions = [];

    function podPositions(blocks_per_group, number_of_groups) {
        var ret = [];
        var wgroup = blocks_per_group * padg;
        var wgroups = wgroup * (number_of_groups - 1);
        var offset = -wgroups/2;

        for (var i = 0; i < number_of_groups; i++) {
            var wpods = blocks_per_group * padi;
            var goffset = wgroup * i - wpods/2;
            
            for (var j = 0; j < blocks_per_group; j++) {
                ret.push(offset + goffset + padi * j);
            }
        }
        return ret

    }
    linePositions[0] = podPositions(number_of_spine_blocks_per_group, number_of_spine_groups);
    linePositions[1] = podPositions(number_of_aggregation_blocks_per_group, number_of_aggregation_groups);
    linePositions[2] = podPositions(number_of_ToR_blocks_per_group, number_of_ToR_groups);


    function drawPods(list, y) {
        for (var j = 0, n = list.length; j < n; j++) {
            svg.append("rect")
                .attr("class", "pod")
                .attr("width", podw)
                .attr("height", podh)
                .attr("x", list[j] - podw/2)
                .attr("y", y - podh/2);
        }
    }

    function drawHost(x, y, dy, dx) {
        svg.append("line")
            .attr("class", "cable")
            .attr("x1", x)
            .attr("y1", y)
            .attr("x2", x + dx)
            .attr("y2", y + dy);

        svg.append("circle")
            .attr("class", "host")
            .attr("cx", x + dx)
            .attr("cy", y + dy)
            .attr("r", hostr);
    }

    function drawHosts(list, y, direction) {
        for (var i = 0; i < list.length; i++) {
            if (k == 1) {
                drawHost(list[i], y, hhost * direction, 0);
            } else if (k == 2) {
                drawHost(list[i], y, hhost * direction, +2);
            } else if (k == 3) {
                drawHost(list[i], y, hhost * direction, 0);
            } else {
                drawHost(list[i], y, hhost * direction, 0);
            }
        }
    }
    
    function linePods(parent, child, y1, y2, name) {
        if(name=="spine"){
            // Spine is split into len(parent)/aggregation blocks in a group
            // Each of them connects to only 1 aggregation block of each aggregation group
            var number_of_parent_groups = parent.length/number_of_aggregation_blocks_per_group
            for(var i=0;i<number_of_parent_groups;i++){
                for(var ii=0;ii<number_of_aggregation_blocks_per_group;ii++){
                    parent_node = i*number_of_aggregation_blocks_per_group + ii
                    for(var iii=0;iii<number_of_aggregation_groups;iii++){
                        child_node = ii + iii * number_of_aggregation_blocks_per_group
                        svg.append("line")
                            .attr("class", "cable")
                            .attr("x1", parent[parent_node])
                            .attr("y1", y1)
                            .attr("x2", child[child_node])
                            .attr("y2", y2);
                    }
                }
            }
        }else if(name=="aggregation"){
            // Each aggregation connect to number_of_ToR_groups children
            for(var i=0;i<number_of_aggregation_groups;i++){
                for(var ii=0;ii<number_of_aggregation_blocks_per_group;ii++){
                    parent_node = i*number_of_aggregation_blocks_per_group + ii
                    child_start = i*number_of_ToR_blocks_per_group
                    for(var iii=0;iii<number_of_ToR_blocks_per_group;iii++){
                        child_node = child_start + iii
                        svg.append("line")
                            .attr("class", "cable")
                            .attr("x1", parent[parent_node])
                            .attr("y1", y1)
                            .attr("x2", child[child_node])
                            .attr("y2", y2);
                    }
                }
            }
        }else if(name=="ToR"){
            // No child
        }
    }

    linePods(linePositions[0], linePositions[1], 0 * hline, (1) * hline, "spine");
    linePods(linePositions[1], linePositions[2], 1 * hline, (2) * hline, "aggregation");

    // drawHosts(linePositions[depth - 1], (depth - 1) * hline, 1);

    drawPods(linePositions[0], 0);
    drawPods(linePositions[1], 1 * hline);
    drawPods(linePositions[2], 2 * hline);

}

