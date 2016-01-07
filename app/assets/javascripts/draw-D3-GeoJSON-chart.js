/*jslint browser:true, devel:true */
/*global $, d3 */

function drawD3GeoJSONChart(targetElement, dataset, geojson) {
    'use strict';

    var data = dataset.data;

    // 表示領域の大きさ
    var w = 960;
    var h = 600;

    // SVG要素の生成
    var svg = d3.select(targetElement)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // メルカトル図法を設定
    var projection = d3.geo.mercator()
        .scale(15000)
        .center(d3.geo.centroid(geojson))
        .translate([w / 2, h / 2]);

    // パス・ジェネレータの設定
    var path = d3.geo.path()
        .projection(projection);

    // 塗りの色の設定(http://colorbrewer2.org/で生成)
    var color = d3.scale.quantize()
        .range(
            ['rgb(255,255,229)', 'rgb(247,252,185)', 'rgb(217,240,163)', 'rgb(173,221,142)', 'rgb(120,198,121)', 'rgb(65,171,93)', 'rgb(35,132,67)', 'rgb(0,104,55)', 'rgb(0,69,41)']
        );

    // 色と値の対応づけ
    color.domain([
        d3.min(data, function (d) {
            return d.value;
        }),
        d3.max(data, function (d) {
            return d.value;
        })
    ]);

    // GeoJSONのfeaturesごとにデータをバインドし、色を塗る
    svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function (d) {
            var value;
            var municipality = d.properties.N03_004;

            // 六ヶ所村の表記の揺れを修正
            municipality = municipality.replace("六ケ所村", "六ヶ所村");
            var i = 0;
            while (i < data.length) {
                if (data[i].municipality === municipality) {
                    value = data[i].value;
                    break;
                }
                i += 1;
            }
            if (value) {
                return color(value);
            } else {
                return "#ccc";
            }
        })
        .style("stroke", "#ccc");

    // 市役所の位置に人口を赤丸で表示(おまけ)
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return projection([d.lng, d.lat])[0];
        })
        .attr("cy", function (d) {
            return projection([d.lng, d.lat])[1];
        })
        .attr("r", function (d) {
            return Math.sqrt(d.value / 300);
        })
        .style("fill", "red")
        .style("opacity", 0.75);
}
