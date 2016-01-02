/*jslint browser:true, devel:true */
/*global $, Flotr */

// 棒グラフの表示
function drawFlotr2HorizontalBarsChart(targetElement, dataset) {
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
        $(targetElement)[0],
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
