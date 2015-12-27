/*jslint browser:true, devel:true */
/*global $, Flotr */

$(document).ready(
    function () {
        'use strict';

        var horizontalData = [];
        var horizontalXaxisLabels = [];
        var pieData = [];

        // データの整形
        function formatData(dataset, horizontalData, horizontalXaxisLabels, pieData) {
            dataset.data.forEach(function (datum, idx) {
                horizontalData.push([datum.value, idx]);
                pieData.push({label: datum.municipality, data: [[0, datum.value]]});
                horizontalXaxisLabels.push([idx, datum.municipality]);
            });
        }

        // 棒グラフの表示
        function drawBars(title, horizontalData, horizontalXaxisLabels) {
            Flotr.draw(
                $("#horizontal-bars")[0],
                [horizontalData],
                {
                    title: title,
                    bars: {
                        show: true,
                        horizontal: true,
                        barWidth: 0.5,
                        shadowSize: 0,
                        fillOpacity: 1,
                        lineWidth: 0
                    },
                    xaxis: {
                        min: 0,
                        tickDecimals: 0
                    },
                    yaxis: {
                        ticks: horizontalXaxisLabels
                    },
                    grid: {
                        horizontalLines: false,
                        verticalLines: false
                    },
                    mouse: {
                        track: true
                    }
                }
            );
        }

        // 円グラフの表示
        function drawPie(pieData) {
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
                        explode: 6
                    },
                    mouse: {
                        track: true
                    },
                    legend: {
                        position: 'ne',
                        backgroundColor: '#D2E8FF'
                    }
                }
            );
        }

        var pathname = location.pathname;
        var lastIndex = pathname.lastIndexOf("/");
        var jsonPathname = pathname.substring(0, lastIndex) + ".json";

        $.getJSON(jsonPathname, function (dataset) {
            formatData(dataset, horizontalData, horizontalXaxisLabels, pieData);

            drawBars(dataset.dataset, horizontalData, horizontalXaxisLabels);
            drawPie(pieData);
            $(".flotr-dummy-div").parent().hide();
        });

    }
);
