/*jslint browser:true, devel:true */
/*global google, $, Flotr, window */

var map;
var datasets = [];
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
function createMarker(data, range, align) {
    'use strict';

    var title, color, origin, value, icon, marker, position;

    title = data.municipality;
    position = {
        lat: data.lat,
        lng: data.lng
    };
    value = data.value / range.max * 50;

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

    icon = {
        path: 'M ' + origin + ',' + (-1 * value) + ' v ' + value + ' a 5 3 0 0 1 -10,0 v ' + (-1 * value) + 'M ' + origin + ',' + (-1 * value) + ' a 5 3 0 0 1 -10,0 a 5 3 180 0 1 10,0',
        fillColor: color,
        fillOpacity: 0.8,
        scale: 1,
        strokeColor: 'black',
        strokeWeight: 1
    };

    marker = new google.maps.Marker({map: map, position: position, icon: icon, title: title});
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

// データの最小最大値からグラフの上限と下限を適当に計算
function calcRange(data) {
    'use strict';

    var min, max, rangeMin, rangeMax, figure, mostSignificantDigit;

    // 最小値
    min = data.reduce(function (a, b) {
        if (a < b) {
            return a;
        } else {
            return b;
        }
    });

    // 最大値
    max = data.reduce(function (a, b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    });

    // 最大値から適当なグラフの上限を求める
    if (max >= 0) {
        // 桁数
        figure = Math.ceil(Math.log10(max));
        // 最上位桁の値
        mostSignificantDigit = Math.floor(max / Math.pow(10, figure - 1));
        rangeMax = (mostSignificantDigit + 1) * Math.pow(10, figure - 1);
    } else {
        // 桁数
        figure = Math.ceil(Math.log10(-max));
        // 最上位桁の値
        mostSignificantDigit = Math.floor(-max / Math.pow(10, figure - 1));
        rangeMax = -1 * (mostSignificantDigit - 1) * Math.pow(10, figure - 1);
    }

    if (min >= 0) {
        rangeMin = 0;
    } else {
        // 桁数
        figure = Math.ceil(Math.log10(-min));
        // 最上位桁の値
        mostSignificantDigit = Math.floor(-min / Math.pow(10, figure - 1));
        rangeMin = -1 * (mostSignificantDigit + 1) * Math.pow(10, figure - 1);
    }

    return {min: rangeMin, max: rangeMax};
}

// データセットを表示
function showDataset(datasetId, align) {
    'use strict';

    var marker, markers = [];

    // データを読んでマーカーを表示
    $.getJSON("/datasets/" + datasetId + ".json", function (dataset) {
        var data, range;
        if (displayGoogleMap === true) {
            // 数値データのみ取り出す
            data = dataset.data.map(function (datum) {
                return datum.value;
            });

            range = calcRange(data);

            dataset.data.forEach(function (data) {
                marker = createMarker(data, range, align);
                markers.push(marker);
            });
        }

        datasets[align] = {datasetId: datasetId, name: dataset.dataset, data: dataset.data, markers: markers};

        if (datasets.left && datasets.right) {
            $("#display-correlation").prop("disabled", false);
        }
    });
}

function formatScatterData(datasetX, datasetY) {
    'use strict';

    var scatterData = [],
        dataXY = [],
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
    dataXY.forEach(function (datum) {
        scatterData.push([datum.x, datum.y]);
    });

    return scatterData;
}

// 散布図の表示
function drawScatter(scatterData) {
    'use strict';

    // 散布図の描画
    Flotr.draw(
        $("#scatter-chart")[0],
        [{
            data: scatterData,
            points: {show: true}
        }],
        {
            title: "散布図",
            subtitle: "",
            xaxis: {
                title: datasets.left.name
            },
            yaxis: {
                title: datasets.right.name
            },
            mouse: {
                track: true,
                relative: true
            }
        }
    );
    $(".flotr-dummy-div").parent().hide();
}

function calcCorrelationCoefficient(scatterData) {
    'use strict';

    var averageX = 0,
        averageY = 0,
        averageSquareX = 0,
        averageSquareY = 0,
        averageXY = 0,
        i,
        length;

    // それぞれの平均を求める
    i = 0;
    length = scatterData.length;
    while (i < length) {
        averageX += scatterData[i][0];
        averageY += scatterData[i][1];
        averageSquareX += scatterData[i][0] * scatterData[i][0];
        averageSquareY += scatterData[i][1] * scatterData[i][1];
        averageXY += scatterData[i][0] * scatterData[i][1];
        i += 1;
    }

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
    msg = '<p>x軸: ' + datasets.left.name + '<br>';
    msg += 'y軸: ' + datasets.right.name + '<br>';
    msg += '相関係数: ' + correlationCoefficient + '</p>';
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
        // データセット選択エリアの設定
        jsonArray.forEach(function (json) {
            $("#dataset-select-left").append('<option value="' + json.id + '">' + json.name + '</option>');
            $("#dataset-select-right").append('<option value="' + json.id + '">' + json.name + '</option>');
        });

        // データセット左のイベントハンドラ
        $("#dataset-select-left").on('change', function () {
            var id;
            // 既存のデータセット左を削除
            hideDataset('left');
            // 「2つのデータを比較」ボタンを無効化
            $("#display-correlation").prop("disabled", true);
            // データセット右のオプションをすべて有効化
            $("#dataset-select-right option").prop("disabled", false);

            // データセット左に入っているデータのidを取得
            id = $("[name=dataset-select-left]").val();
            if (id !== "") {
                // データセット左に入っているidと同じデータセット右のオプションを無効化
                $("#dataset-select-right option[value=" + id + "]").prop("disabled", true);
                // マップにデータセット左を表示
                showDataset(id, 'left');
            }
        });

        // データセット右のイベントハンドラ
        $("#dataset-select-right").on('change', function () {
            var id;
            // 既存のデータセット右を削除
            hideDataset('right');
            // 「2つのデータを比較」ボタンを無効化
            $("#display-correlation").prop("disabled", true);
            // データセット左のオプションをすべて有効化
            $("#dataset-select-left option").prop("disabled", false);

            // データセット右に入っているデータのidを取得
            id = $("[name=dataset-select-right]").val();
            if (id !== "") {
                // データセット右に入っているidと同じデータセット右のオプションを無効化
                $("#dataset-select-left option[value=" + id + "]").prop("disabled", true);
                // マップにデータセット右を表示
                showDataset(id, 'right');
            }
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

    // ウィンドウサイズが変更された場合にマップの表示領域をリサイズする
    $(window).on('resize', fitMapAreaToWindow);

    // データセット比較の初期化
    initCorrelation();
});
