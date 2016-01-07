/*jslint browser:true, devel:true, this:true */
/*global $, google, d3 */

function drawD3GoogleMapsBarsChart(targetElement, dataset) {
    'use strict';
    var data, max, padding, rx, ry, maxBarHeight, yScale, map, overlay;

    // 描画データ
    data = dataset.data;
    max = d3.max(dataset.data, function (d) {
        return d.value;
    });

    // グラフのパラメータ
    padding = 10;
    rx = 5;
    ry = 2;
    maxBarHeight = 80;

    // グラフの高さを計算する関数
    yScale = d3.scale.linear()
        .domain([0, max])
        .range([padding + maxBarHeight, padding])
        .nice();

    // マップの生成
    map = new google.maps.Map($(targetElement)[0], {
        zoom: 9,
        center: {lat: 41.0121782, lng: 140.6787885}
    });


    // オーバーレイの生成
    overlay = new google.maps.OverlayView();

    // マップにオーバーレイを追加したときに実行する関数
    overlay.onAdd = function () {
        // オーバーレイするレイヤー
        var layer = d3.select(overlay.getPanes().overlayLayer)
            .append("div")
            .attr("class", "bars-chart");

        // オーバーレイの描画
        overlay.draw = function () {
            // オーバーレイへの座標返還するためのオブジェクト
            var projection = overlay.getProjection();

            // 座標返還の計算
            function transform(d) {
                d = new google.maps.LatLng(d.value.lat, d.value.lng);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding - maxBarHeight) + "px");
            }

            // マーカーの生成
            var marker = layer.selectAll("svg")
                .data(d3.entries(data))
                .each(transform) // 座標返還
                .enter()
                .append("svg:svg")
                .each(transform)
                .attr("class", "marker")
                .style("overflow", "visible")
                .on("mouseover", function () {
                    console.log("mouseover");
                })
                .on("mouseout", function () {
                    console.log("mouseout");
                });

            // 下の楕円
            marker.append("svg:ellipse")
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("cx", padding)
                .attr("cy", padding + 80)
                .attr("fill", "red")
                .attr("stroke", "black")
                .attr("stoke-width", "1px");

            // 長方形
            marker.append("svg:rect")
                .attr("x", padding - rx)
                .attr("y", function (d) {
                    return yScale(d.value.value);
                })
                .attr("width", rx * 2)
                .attr("height", function (d) {
                    return padding + maxBarHeight - yScale(d.value.value);
                })
                .attr("fill", "red");

            // 長方形の左の線
            marker.append("svg:line")
                .attr("x1", padding - rx)
                .attr("y1", function (d) {
                    return yScale(d.value.value);
                })
                .attr("x2", padding - rx)
                .attr("y2", padding + 80)
                .attr("stroke", "black")
                .attr("stoke-width", "1px");

            // 長方形の右の線
            marker.append("svg:line")
                .attr("x1", padding + rx)
                .attr("y1", function (d) {
                    return yScale(d.value.value);
                })
                .attr("x2", padding + rx)
                .attr("y2", padding + 80)
                .attr("stroke", "black")
                .attr("stoke-width", "1px");

            // 上の楕円
            marker.append("svg:ellipse")
                .attr("rx", rx)
                .attr("ry", ry)
                .attr("cx", padding)
                .attr("cy", function (d) {
                    return yScale(d.value.value);
                })
                .attr("fill", "red")
                .attr("stroke", "black")
                .attr("stoke-width", "1px");

            // ラベル
            marker.append("svg:text")
                .attr("x", padding + 6)
                .attr("y", function (d) {
                    return yScale(d.value.value);
                })
                .attr("fill", "red")
                .text(function (d) {
                    return d.value.value;
                });
        };
    };

    // マップにオーバーレイする
    overlay.setMap(map);
}
