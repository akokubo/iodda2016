/*jslint browser:true, devel:true */
/*global $, d3 */

function drawD3HorizonatlBarsChart(dataset) {
    'use strict';

    // グラフ表示領域のサイズ
    var w = 960;
    var h = 600;

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
        .range([0, w - Math.log10(valueMax) * 11 - labelWidth]);

    // y軸のスケール
    var yScale = d3.scale.ordinal()
        .domain(d3.range(dataset.length))
        .rangeRoundBands([0, h], 0.05);

    // SVG要素を作る
    var svg = d3.select("#d3-horizontal-bars")
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
                var blue = Math.floor(d.value * 128 / valueMax + 127);
                return "rgb(0, 0, " + blue + ")";
            })
            .attr("transform", "translate(" + labelWidth + ", 0)");
    };

    // 棒グラフの右に値を表示する
    var drawValues = function () {
        svg.selectAll("text.value")
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
        svg.selectAll("text.label")
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
            .attr("text-anchor", "end")
            .attr("transform", "translate(" + (labelWidth - fontSize) + ", 0)");
    };

    drawBars();
    drawValues();
    drawLabels();
}


$(document).ready(function () {
    'use strict';

    // 取得するJSONのパス名を求める
    var pathname = location.pathname;
    var lastIndex = pathname.lastIndexOf("/");
    var jsonPathname = pathname.substring(0, lastIndex) + ".json";

    $.getJSON(jsonPathname, function (dataset) {
        drawD3HorizonatlBarsChart(dataset.data);
    });
});
