/*jslint browser:true, devel:true */
/*global $, d3 */

function drawD3HorizonatlBarsChart(targetElement, dataset) {
    'use strict';

    // グラフ表示領域のサイズ
    var w = 960;
    var h = 600;
    var padding = 20;

    // フォントの大きさ
    var fontSize = 11;
    // ラベルの幅
    var labelWidth = fontSize * 6;

    // 最大値を求める
    var valueMax = d3.max(dataset, function (d) {
        return d.value;
    });

    // x軸のスケール
    var xScale = d3.scale.linear()
        .domain([0, valueMax])
        .range([padding, w - padding - Math.log10(valueMax) * 11 - labelWidth])
        .nice();

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    // 塗りの色の設定(http://colorbrewer2.org/で生成)
    var color = d3.scale.linear()
        .domain([0, valueMax])
        .nice()
        .range(
            ['rgb(224,243,219)', 'rgb(67,162,202)']
        );

    // y軸のスケール
    var yScale = d3.scale.ordinal()
        .domain(d3.range(dataset.length))
        .rangeRoundBands([padding, h - padding], 0.05);

    // SVG要素を作る
    var svg = d3.select(targetElement)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // 棒グラフを表示する
    var drawBars = function () {
        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function (d, i) {
                return yScale(i);
            })
            .attr("width", function (d) {
                return xScale(d.value);
            })
            .attr("height", yScale.rangeBand())
            .attr("fill", function (d) {
                return color(d.value);
                //var blue = Math.floor(d.value * 128 / valueMax + 127);
                //return "rgb(0, 0, " + blue + ")";
            })
            .attr("transform", "translate(" + labelWidth + ", 0)");
    };

    // スケールを表示する
    var drawScale = function () {
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (labelWidth - padding) + ", " + (h - padding * 2 + 2) + ")")
            .call(xAxis);

        svg.selectAll(targetElement + " .axis path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("shape-rendering", "crispEdges");

        svg.selectAll(targetElement + " .axis line")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("shape-rendering", "crispEdges");

        svg.selectAll(targetElement + " .axis text")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px");
    };

    // 棒グラフの右に値を表示する
    var drawValues = function () {
        svg.selectAll(targetElement + " text.value")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "value")
            .text(function (d) {
                return d.value;
            })
            .attr("x", function (d) {
                return xScale(d.value) + 3;
            })
            .attr("y", function (d, i) {
                return yScale(i) + yScale.rangeBand() / 2 + 5;
            })
            .attr("transform", "translate(" + labelWidth + ", 0)");
    };

    // 棒グラフにラベルを追加する
    var drawLabels = function () {
        svg.selectAll(targetElement + " text.label")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "label")
            .text(function (d) {
                return d.municipality;
            })
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d, i) {
                return yScale(i) + yScale.rangeBand() / 2 + 5;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("text-anchor", "end")
            .attr("transform", "translate(" + (labelWidth - fontSize) + ", 0)");
    };

    drawBars();
    drawScale();
    drawValues();
    drawLabels();
}
