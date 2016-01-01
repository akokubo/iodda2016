/*jslint browser:true, devel:true */
/*global $, d3 */

function drawD3PieChart(dataset) {
    'use strict';

    // グラフ表示領域のサイズ
    var w = 600;
    var h = 600;

    // フォントの大きさ
    var fontSize = 11;
    // ラベルの幅
    var labelWidth = fontSize * 6;



    var outerRadius = w / 2;
    var innerRadius = w / 4;
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    
    var pie = d3.layout.pie();
    
    //Easy colors accessible via a 10-step ordinal scale
    var color = d3.scale.category10();

    //Create SVG element
    var svg = d3.select("#d3-pie")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
    
    //Set up groups
    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset.map(function (d) { return d.value; })))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
    
    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);
    
    //Labels
    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.value;
        });
}


$(document).ready(function () {
    'use strict';

    // 取得するJSONのパス名を求める
    var pathname = location.pathname;
    var lastIndex = pathname.lastIndexOf("/");
    var jsonPathname = pathname.substring(0, lastIndex) + ".json";

    $.getJSON(jsonPathname, function (dataset) {
        drawD3PieChart(dataset.data);
    });
});
