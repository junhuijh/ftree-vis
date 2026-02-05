$(document).ready(docMain);

var conf = new Object();
conf['depth'] = 3;
conf['width'] = 8;

var controlVisible = true;

function docMain() {
    formInit();
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
    drawFatTree(conf['depth'], conf['width']);
}

function drawFatTree(depth, width) {
    var k = Math.floor(width / 2);
    var padg = 13;
    var padi = 12;
    var hline = 70;
    var hhost = 50;

    var podw = 8;
    var podh = 8;
    var hostr = 2;

    var kexp = function (n) { return Math.pow(k, n); };

    d3.select("svg.main").remove();   
    if (kexp(depth - 1) > 1500 || depth <= 0 || k <= 0) {
        return;
    }

    var w = kexp(depth - 1) * (podw+20) + 400;
    var h = (depth) * (hline+1);

    var svg = d3.select("#canvas-container").append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "main")
        .append("g")
        .attr("transform", "translate(" + w/2 + "," + 4 + ")");

    var linePositions = [];

    function podPositions(d) {
        var ret = [];
        // Each row has 2*k^d number of switches
        // Except for spine which has k^d
        var number_of_groups;
        if(d==0){
            number_of_groups = kexp(d);
        }else{
            number_of_groups = kexp(d)*2;
        }
        var number_of_pods_per_group = kexp(depth - 1 - d);


        var wgroup = number_of_pods_per_group * padg;
        var wgroups = wgroup * (number_of_groups - 1);
        var offset = -wgroups/2;

        for (var i = 0; i < number_of_groups; i++) {
            var wpods = number_of_pods_per_group * padi;
            var goffset = wgroup * i - wpods/2;
            
            for (var j = 0; j < number_of_pods_per_group; j++) {
                ret.push(offset + goffset + padi * j);
            }
        }

        return ret
    }

    for (var i = 0; i < depth; i++) {
        linePositions[i] = podPositions(i);
    }

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
    
    function linePods(d, list1, list2, y1, y2) {
        // The spine has double the lines
        var number_of_groups;
        if(d==0){
            number_of_groups = kexp(d);
        }else{
            number_of_groups = kexp(d)*2;
        }
        var number_of_pods_per_group = kexp(depth - 1 - d);
        var perbundle = number_of_pods_per_group / k;
        

        if (d==0){
            var length_of_parent = list1.length;
            var number_of_children_groups = kexp(d+1)*2;
            var number_of_pods_per_child_group = kexp(depth - 1 - d-1);

            var number_of_groups = number_of_pods_per_child_group
            var number_of_items_per_group = length_of_parent/number_of_groups

            for(var group=0;group<number_of_groups;group++){
                for(var item=0;item<number_of_items_per_group;item++){
                    var parent_start = number_of_items_per_group*group;
                    for (var child = 0; child < number_of_children_groups; child++) {
                        var ifather = parent_start+item;
                        var ichild = number_of_pods_per_child_group*child + group;
                        svg.append("line")
                            .attr("class", "cable")
                            .attr("x1", list1[ifather])
                            .attr("y1", y1)
                            .attr("x2", list2[ichild])
                            .attr("y2", y2);
                    }
                }
            }
            // for(var i=length_of_parent/2;i<length_of_parent;i++){
            //     for (var child = 0; child < number_of_children_groups; child++) {
            //         var ifather = i;
            //         var ichild = number_of_pods_per_child_group*child + 1;
            //         svg.append("line")
            //             .attr("class", "cable")
            //             .attr("x1", list1[ifather])
            //             .attr("y1", y1)
            //             .attr("x2", list2[ichild])
            //             .attr("y2", y2);
            //     }
            // }

        }else{
            for (var i = 0; i < number_of_groups; i++) {
                var offset = number_of_pods_per_group * i;
                for (var j = 0; j < k; j++) {
                    var boffset = perbundle * j;
                    for (var t = 0; t < perbundle; t++) {
                        var ichild = offset + boffset + t;
                        for (var a = 0; a < k; a++) {
                            var ifather = offset + perbundle * a + t;
                            svg.append("line")
                                .attr("class", "cable")
                                .attr("x1", list1[ifather])
                                .attr("y1", y1)
                                .attr("x2", list2[ichild])
                                .attr("y2", y2);
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < depth - 1; i++) {
        linePods(i, linePositions[i], linePositions[i + 1], i * hline, (i + 1) * hline);
    }

    drawHosts(linePositions[depth - 1], (depth - 1) * hline, 1);

    for (var i = 0; i < depth; i++) {
        if (i == 0) {
            drawPods(linePositions[0], 0);
        } else {
            drawPods(linePositions[i], i * hline);
        }
    }
}

function updateStat() {
    var w = Math.floor(conf['width'] / 2);
    var d = conf['depth'];
    if (d == 0 || w == 0) {
        d3.select("#nhost").html("&nbsp;");
        d3.select("#nswitch").html("&nbsp;");
        d3.select("#ncable").html("&nbsp;");
        d3.select("#ntx").html("&nbsp;");
        d3.select("#nswtx").html("&nbsp;");
        return;
    }
    
    var line = Math.pow(w, d - 1);

    var nhost = 2 * line * w;
    var nswitch = (2 * d - 1) * line;
    var ncable = (2 * d) * w * line;
    var ntx = 2 * (2 * d) * w * line;
    var nswtx = ntx - nhost;

    d3.select("#nhost").html(formatNum(nhost));
    d3.select("#nswitch").html(formatNum(nswitch));
    d3.select("#ncable").html(formatNum(ncable));
    d3.select("#ntx").html(formatNum(ntx));
    d3.select("#nswtx").html(formatNum(nswtx));
}

function formatNum(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function formInit() {
    var form = d3.select("form");

    function confInt() { 
        conf[this.name] = parseInt(this.value); 
        updateStat();
        redraw();
    }

    function hook(name, func) {
        var fields = form.selectAll("[name=" + name + "]");
        fields.on("change", func);
        fields.each(func);
    }

    hook("depth", confInt);
    hook("width", confInt);
}

