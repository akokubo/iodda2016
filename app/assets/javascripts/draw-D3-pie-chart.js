/*jslint browser:true, devel:true */
/*global $, d3 */

function drawD3PieChart(targetElement, dataset) {
    'use strict';

    // グラフ表示領域のサイズ
    var w = 960;
    var h = 600;
    var padding = 100;
    var r;

    if (w < h) {
        r = w - padding;
    } else {
        r = h - padding;
    }

    var sum = d3.sum(dataset.data, function (d) {
        return d.value;
    });

    var outerRadius = r / 2;
    var innerRadius = r / 4;
    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    //Easy colors accessible via a 10-step ordinal scale
    var color = d3.scale.category10();

    //Create SVG element
    var svg = d3.select(targetElement)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // グループの設定
    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset.data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");


    // グラフの描画
    arcs.append("path")
        .attr("fill", function (d, i) {
            return color(i);
        })
        .attr("d", arc)
        .on("mouseover", function (d) {
            d3.select(this)
                .attr("stroke", "black")
                .attr("opacity", 0.7);
            d3.selectAll(targetElement + " text.municipality")
                .text(d.data.municipality);
            d3.selectAll(targetElement + " text.value")
                .text(d.value);
            d3.selectAll(targetElement + " text.percentage")
                .text(((d.value / sum * 100).toFixed(1)) + "%");
        })
        .on("mouseout", function () {
            d3.select(this)
                .attr("stroke", "none")
                .attr("opacity", 1);
            d3.selectAll(targetElement + " text.municipality")
                .text("市町村名");
            d3.selectAll(targetElement + "t ext.value")
                .text("値");
            d3.selectAll(targetElement + " text.percentage")
                .text("パーセンテージ");
        });

    // ラベルの表示
    arcs.append("text")
        .attr("transform", function (d) {
//            var scale = 1 + innerRadius / outerRadius;
            var scale = 1.5;
            var arcCentroid = arc.centroid(d);
            var arcsCentroid = [0, 0];
            var pointingVector = [
                arcCentroid[0] - arcsCentroid[0],
                arcCentroid[1] - arcsCentroid[1]
            ];
            var coordinate = [
                arcsCentroid[0] + scale * pointingVector[0],
                arcsCentroid[1] + scale * pointingVector[1]
            ];
            return "translate(" + coordinate + ")";
        })
        .attr("class", "arcLabel")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .text(function (d) {
            return d.data.municipality;
        });

    // タイトルの表示
    svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(" + (w / 2) + ", " + ((h / 2) - 36) + ")")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text(dataset.dataset);

    // 市町村名の表示
    svg.append("text")
        .attr("class", "municipality")
        .attr("transform", "translate(" + (w / 2) + ", " + ((h / 2) - 12) + ")")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("市町村名");

    // 値の表示
    svg.append("text")
        .attr("class", "value")
        .attr("transform", "translate(" + (w / 2) + ", " + ((h / 2) + 12) + ")")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("値");

    // パーセンテージの表示
    svg.append("text")
        .attr("class", "percentage")
        .attr("transform", "translate(" + (w / 2) + ", " + ((h / 2) + 36) + ")")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("パーセンテージ");
}
