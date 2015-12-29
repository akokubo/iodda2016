/*jslint browser:true, devel:true */
/*global $, Flotr */

// 棒グラフの表示
function drawBars(dataset) {
    'use strict';

    var barsData,
        barData = [],
        yAxisLabels = [],
        length;

    // データの整形
    length = dataset.data.length;
    dataset.data.forEach(function (datum, idx) {
        // ふつうにデータを作ると、下から上に積みあがるので、それを上下逆に
        barData.push([datum.value, length - idx - 1]);
        yAxisLabels.push([length - idx - 1, datum.municipality]);
    });
    barsData = [barData];

    // グラフの描画
    Flotr.draw(
        $("#horizontal-bars")[0],
        barsData,
        {
            title: dataset.dataset,
            bars: {
                show: true,
                horizontal: true,
                barWidth: 0.6,
                shadowSize: 0,
                fillOpacity: 1,
                lineWidth: 0
            },
            xaxis: {
                min: 0,
                tickDecimals: 0
            },
            yaxis: {
                ticks: yAxisLabels
            },
            grid: {
                horizontalLines: false,
                verticalLines: false
            },
            mouse: {
                track: true,
                relative: true
            }
        }
    );
}

// 円グラフの表示
function drawPie(dataset) {
    'use strict';

    var pieData = [];

    // データの整形
    dataset.data.forEach(function (datum) {
        pieData.push({label: datum.municipality, data: [[0, datum.value]]});
    });

    // グラフの描画
    Flotr.draw(
        $("#pie")[0],
        pieData,
        {
            HtmlText: false,
            grid: {
                verticalLines: false,
                horizontalLines: false
            },
            xaxis: {
                showLabels: false
            },
            yaxis: {
                showLabels: false
            },
            pie: {
                show: true,
                explode: 6 // 6ピクセル中心から押し出す
            },
            mouse: {
                track: true,
                relative: true
            },
            legend: {
                position: 'ne', // 北東に凡例を表示
                backgroundColor: '#D2E8FF'
            }
        }
    );
}

$(document).ready(function () {
    'use strict';

    // 取得するJSONのパス名を求める
    var pathname = location.pathname;
    var lastIndex = pathname.lastIndexOf("/");
    var jsonPathname = pathname.substring(0, lastIndex) + ".json";

    $.getJSON(jsonPathname, function (dataset) {
        // 棒グラフの描画
        drawBars(dataset);
        // 円グラフの描画
        drawPie(dataset);
        $(".flotr-dummy-div").parent().hide();
    });
});
