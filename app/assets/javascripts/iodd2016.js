/*jslint browser:true, devel:true, this:true */
/*global google, $, window, d3 */

var map;
var datasets = [];
var maxBarHeight = 50;
var displayGoogleMap = true;

// マップ表示領域の高さを画面に合わせる
function fitMapAreaToWindow() {
    'use strict';

    var mapElement, mapElementTop, footerTop, debugDumpHeight, mapElementHeight;

    mapElement = $("#map");

    // 各要素の高さを求める
    mapElementTop = mapElement.offset().top;
    footerTop = $("#footer").offset().top;
    debugDumpHeight = $(".debug_dump").outerHeight(true);

    // マップ要素の高さを計算する
    mapElementHeight = footerTop - mapElementTop - debugDumpHeight - 45;
    // マップ要素の高さを設定する
    mapElement.height(mapElementHeight);
}

// マーカーを生成
function createMarker(datum, yScale, align) {
    'use strict';

    var title, color, origin, barHeight, icon, marker, position, path, infoWindow;

    // タイトル
    title = datum.municipality;

    // マーカーの表示座標
    position = {
        lat: datum.lat,
        lng: datum.lng
    };

    // 棒グラフの高さ
    barHeight = yScale(datum.value);

    // マーカーの表示位置を左右にずらす
    if (align === 'left') {
        color = 'red';
        origin = -5;
    } else if (align === 'right') {
        color = 'yellow';
        origin = 5;
    } else {
        color = 'blue';
        origin = 0;
    }

    // 棒グラフの形状
    path = 'M ' + origin + ',' + (-1 * barHeight)
            + ' v ' + barHeight // 右の縦線
            + ' a 5 3 0 0 1 -10,0' // 下の円弧
            + ' v ' + (-1 * barHeight) // 左の縦線
            + 'M ' + origin + ',' + (-1 * barHeight)
            + ' a 5 3 0 0 1 -10,0 a 5 3 180 0 1 10,0'; // 上の楕円

    // アイコンの設定
    icon = {
        path: path,
        fillColor: color,
        fillOpacity: 0.8,
        scale: 1,
        strokeColor: 'black',
        strokeWeight: 1
    };

    // マーカーの生成
    marker = new google.maps.Marker({map: map, position: position, icon: icon, title: title});

    // マーカーにつける情報ウィンドウ
    infoWindow = new google.maps.InfoWindow({content: title + '<br>' + datum.value});

    // マーカーのイベントリスナー
    marker.addListener('mouseover', function () {
        infoWindow.open(map, marker);
    });
    marker.addListener('mouseout', function () {
        infoWindow.close();
    });

    return marker;
}

// 全マーカーを削除
function removeMarkers(align) {
    'use strict';

    datasets[align].markers.forEach(function (marker) {
        marker.setMap(null);
    });
}

// データセットを非表示
function hideDataset(align) {
    'use strict';

    if (datasets[align]) {
        if (displayGoogleMap === true) {
            removeMarkers(align);
        }
        datasets[align] = null;
    }
}

function calcYScale(data, align) {
    'use strict';

    var min, max, yScale;

    min = d3.min(data, function (d) {
        return d.value;
    });

    $("#dataset-" + align + "-data-min").val(min);

    max = d3.max(data, function (d) {
        return d.value;
    });
    $("#dataset-" + align + "-data-max").val(max);

    if (min > 0) {
        min = 0;
    }

    if (max < 0) {
        max = 0;
    }

    yScale = d3.scale.linear()
        .domain([min, max])
        .range([0, maxBarHeight])
        .nice();
    $("#dataset-" + align + "-domain-min").val(yScale.domain()[0]);
    $("#dataset-" + align + "-domain-max").val(yScale.domain()[1]);

    return yScale;
}

function reCalcYScale(domain) {
    'use strict';

    var min, max, yScale;

    min = domain[0];

    max = domain[1];

    yScale = d3.scale.linear()
        .domain([min, max])
        .range([0, maxBarHeight]);

    return yScale;
}

// データセットを再表示
function redrawDataset(dataset, align, domain) {
    'use strict';

    var marker, markers = [];

    var data, yScale;

    if (displayGoogleMap === true) {
        removeMarkers(align);
    }

    data = dataset.data;

    yScale = reCalcYScale(domain);

    if (displayGoogleMap === true) {
        data.forEach(function (datum) {
            marker = createMarker(datum, yScale, align);
            markers.push(marker);
        });
    }

    datasets[align].markers = markers;
}

// データセットを表示
function showDataset(datasetId, align) {
    'use strict';

    var marker, markers = [];

    // データを読んでマーカーを表示
    $.getJSON("/datasets/" + datasetId + ".json", function (dataset) {
        var data, yScale;

        data = dataset.data;

        yScale = calcYScale(data, align);

        if (displayGoogleMap === true) {
            data.forEach(function (datum) {
                marker = createMarker(datum, yScale, align);
                markers.push(marker);
            });
        }

        datasets[align] = {datasetId: datasetId, name: dataset.dataset, data: data, markers: markers};

        if (datasets.left && datasets.right) {
            $("#display-correlation").prop("disabled", false);
        }
    });
}

function formatScatterData(datasetX, datasetY) {
    'use strict';

    var dataXY = [],
        dataX = datasetX.data,
        dataY = datasetY.data,
        i;

    // データの整形
    dataX.forEach(function (datum) {
        i = 0;
        while (i < dataY.length) {
            if (datum.municipality === dataY[i].municipality) {
                dataXY.push({municipality: datum.municipality, x: datum.value, y: dataY[i].value});
                break;
            }
            i += 1;
        }
    });

    return dataXY;
}

function drawScatter(scatterData) {
    'use strict';

    var w = 860;
    var h = 500;
    var margin = 10;
    var paddingTop = 10;
    var paddingRight = 50;
    var paddingBottom = 45;
    var paddingLeft = 100;


    var dataset = scatterData;

    d3.selectAll("svg").remove();

    //Create SVG element
    var svg = d3.select("#scatter-chart")
        .append("svg")
        .attr("width", w - margin * 2)
        .attr("height", h - margin * 2);

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function (d) {
            return d.x;
        })])
        .range([paddingLeft, w - 2 * margin - paddingRight])
        .nice();

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function (d) {
            return d.y;
        })])
        .range([h - 2 * margin - paddingBottom, paddingTop])
        .nice();

    // X軸の生成
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    // Y軸の生成
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    // X軸の表示
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - 2 * margin - paddingBottom) + ")")
        .call(xAxis);

    // Y軸の表示
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + paddingLeft + ",0)")
        .call(yAxis);

    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d.x);
        })
        .attr("cy", function (d) {
            return yScale(d.y);
        })
        .attr("r", 5)
        .attr("stroke", "deepskyblue")
        .attr("stroke-width", "3px")
        .attr("fill", "lavender")
        .on("mouseover", function (d) {
            var svgElement = d3.select(this);
            svgElement.attr("stroke", "dodgerblue");

            // ツールチップの位置の計算
            var xPosition = parseFloat(svgElement.attr("cx")) + 30;
            var yPosition = parseFloat(svgElement.attr("cy")) + 60;

            // ツールチップの内容
            var msg = d.municipality + "<br>x: " + d.x + "<br>y:" + d.y;

            // ツールチップの位置と内容の指定
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#tooltip-text")
                .html(msg);

            // ツールチップの表示
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function () {
            d3.select(this).attr("stroke", "deepskyblue");
            // ツールチップの非表示
            d3.select("#tooltip").classed("hidden", true);
        });

    // x軸タイトル
    svg.append("text")
        .attr("class", "x-axis-title")
        .attr("transform", "translate(" + ((w + paddingLeft - paddingRight) / 2 - margin) + "," + (h - 2 * margin - 11) + ")")
        .text(datasets.left.name)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px");

    // y軸タイトル
    svg.append("text")
        .attr("class", "y-axis-title")
        .attr("transform", "translate(" + (11 + margin) + ", " + ((paddingTop + h - paddingBottom) / 2) + ") rotate(270)")
        //.attr("transform", "translate(" + 0 + "," + (h / 2 - margin) + ")")
        .text(datasets.right.name)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px");

}

// 相関係数の計算
function calcCorrelationCoefficient(scatterData) {
    'use strict';

    var averageX = 0,
        averageY = 0,
        averageSquareX = 0,
        averageSquareY = 0,
        averageXY = 0,
        i,
        length;

    // それぞれの和を求める
    i = 0;
    length = scatterData.length;
    while (i < length) {
        averageX += scatterData[i].x;
        averageY += scatterData[i].y;
        averageSquareX += scatterData[i].x * scatterData[i].x;
        averageSquareY += scatterData[i].y * scatterData[i].y;
        averageXY += scatterData[i].x * scatterData[i].y;
        i += 1;
    }

    // 和を個数で割って平均を求める
    averageX /= length;
    averageY /= length;
    averageSquareX /= length;
    averageSquareY /= length;
    averageXY /= length;

    return (averageXY - averageX * averageY) / Math.sqrt((averageSquareX - averageX * averageX) * (averageSquareY - averageY * averageY));
}

// 2つのデータの比較を表示
function showCorrelation() {
    'use strict';

    var scatterData, correlationCoefficient, msg;

    // データの整形
    scatterData = formatScatterData(datasets.left, datasets.right);
    // 相関係数の計算
    correlationCoefficient = calcCorrelationCoefficient(scatterData);

    // 表示メッセージの生成
    msg = '<p>相関係数: ' + correlationCoefficient.toFixed(3) + '</p>';
    $("#correlation-coefficient").html(msg);

    // 散布図の描画
    drawScatter(scatterData);
}

// Googleマップのライブラリの読み込み終了後に実行する内容
function initMap() {
    'use strict';

    var mapElement, prefectural = {};

    mapElement = $("#map");

    // マップの表示領域をリサイズする
    fitMapAreaToWindow();

    // 県庁所在地
    prefectural.capital = {lat: 40.824444, lng: 140.74};
    // 県の境界
    prefectural.bounds = {east: 141.683333, north: 41.556111, south: 40.217778, west: 139.496944};

    if (displayGoogleMap === true) {
        // マップの生成
        map = new google.maps.Map(mapElement[0], {
            center: prefectural.capital,
            zoom: 8
        });

        // マップの中心やズームを表示内容に合わせる
        map.fitBounds(prefectural.bounds);
    }
}

// データセット比較の初期化
function initCorrelation() {
    'use strict';

    // 「2つのデータを比較」ボタンを無効化
    $("#display-correlation").prop("disabled", true);

    // データセットを読んで一覧を表示
    $.getJSON("/datasets.json", function (jsonArray) {
        var aligns = ['left', 'right'];

        // 反対側のデータセットを求める
        var opposite = function (align) {
            if (aligns[0] === align) {
                return aligns[1];
            } else if (aligns[1] === align) {
                return aligns[0];
            } else {
                return null;
            }
        };

        // データセット選択エリアの設定
        jsonArray.forEach(function (json) {
            aligns.map(function (align) {
                $("#dataset-select-" + align).append('<option value="' + json.id + '">' + json.name + '</option>');
            });
        });

        // データセットのイベントハンドラ
        aligns.map(function (align) {
            $("#dataset-" + align + "-data-min").val(0);
            $("#dataset-" + align + "-data-max").val(0);
            $("#dataset-" + align + "-domain-min").val(0);
            $("#dataset-" + align + "-domain-max").val(0);

            $("#dataset-" + align + "-domain-min").on('change', function () {
                var min, max;
                min = $("#dataset-" + align + "-domain-min").val();
                max = $("#dataset-" + align + "-domain-max").val();
                if (min < max) {
                    redrawDataset(datasets[align], align, [min, max]);
                }
            });
            $("#dataset-" + align + "-domain-max").on('change', function () {
                var min, max;
                min = $("#dataset-" + align + "-domain-min").val();
                max = $("#dataset-" + align + "-domain-max").val();
                if (min < max) {
                    redrawDataset(datasets[align], align, [min, max]);
                }
            });

            $("#dataset-select-" + align).on('change', function () {
                var id;
                // 既存のデータセットを削除
                hideDataset(align);
                // 「2つのデータを比較」ボタンを無効化
                $("#display-correlation").prop("disabled", true);
                // データセット反対側のオプションをすべて有効化
                $("#dataset-select-" + opposite(align) + " option").prop("disabled", false);

                // データセットに入っているデータのidを取得
                id = $("[name=dataset-select-" + align + "]").val();
                if (id !== "") {
                    // データセット左に入っているidと同じデータセット反対側のオプションを無効化
                    $("#dataset-select-" + opposite(align) + " option[value=" + id + "]").prop("disabled", true);
                    // マップにデータセットを表示
                    showDataset(id, align);
                }
            });
        });

        // データセット比較モーダルの表示のイベントハンドラ
        $("#correlation").on("shown.bs.modal", function () {
            // 散布図の生成
            showCorrelation();
        });

    });
}

$(document).ready(function () {
    'use strict';

    initMap();

    // ウィンドウサイズが変更された場合にマップの表示領域をリサイズする
    $(window).on('resize', fitMapAreaToWindow);

    // データセット比較の初期化
    initCorrelation();
});
