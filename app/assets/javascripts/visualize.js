/*jslint browser:true, devel:true */
/*global $ */
/*global drawD3GeoJSONChart, drawD3HorizonatlBarsChart, drawD3PieChart */
/*global drawD3GoogleMapsGeoJSONChart */
/*global drawFlotr2HorizontalBarsChart, drawFlotr2PieChart */

$(document).ready(function () {
    'use strict';

    // 取得するJSONのパス名を求める
    var pathname = location.pathname;
    var lastIndex = pathname.lastIndexOf("/");
    var jsonPathname = pathname.substring(0, lastIndex) + ".json";

    $.getJSON(jsonPathname, function (dataset) {
        // D3による棒グラフの描画
        drawD3HorizonatlBarsChart("#d3-horizontal-bars-chart", dataset.data);

        // D3による円グラフの描画
        drawD3PieChart("#d3-pie-chart", dataset);

        // D3によるGoogleマップへの棒グラフの描画
        drawD3GoogleMapsBarsChart("#d3-google-maps-bars-chart", dataset);

        d3.json("/aomori-shape.geojson", function (geojson) {
            // D3によるGeoJSONの描画
            drawD3GeoJSONChart("#d3-geojson-chart", dataset, geojson);

            // D3によるGoogleマップへのGeoJSONの描画
            drawD3GoogleMapsGeoJSONChart("#d3-google-maps-geojson-chart", dataset.data, geojson);
        });

        // Flotr2による棒グラフの描画
        drawFlotr2HorizontalBarsChart("#flotr2-horizontal-bars-chart", dataset);
        // 円グラフの描画
        drawFlotr2PieChart("#flotr2-pie-chart", dataset);
        // Flotr2のバグの対応
        $(".flotr-dummy-div").parent().hide();
    });
});
