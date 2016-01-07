/*jslint browser:true, devel:true */
/*global $, Flotr */

// 円グラフの表示
function drawFlotr2PieChart(targetElement, dataset) {
    'use strict';

    var pieData = [];

    // データの整形
    dataset.data.forEach(function (datum) {
        pieData.push({label: datum.municipality, data: [[0, datum.value]]});
    });

    // グラフの描画
    Flotr.draw(
        $(targetElement)[0],
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
