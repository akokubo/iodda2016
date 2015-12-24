/*jslint browser:true, devel:true */
/*global google, $, window */

var datasets = [];

// マップ表示領域の高さを画面に合わせる
function fitMapAreaToWindow() {
    'use strict';
    var mapElement, mapElementTop, footerTop, debugDumpHeight, mapElementHeight;

    mapElement = $("#map");
    mapElementTop = mapElement.offset().top;
    footerTop = $("#footer").offset().top;
    debugDumpHeight = $(".debug_dump").outerHeight(true);
    mapElementHeight = footerTop - mapElementTop - debugDumpHeight - 45;
    mapElement.height(mapElementHeight);
}

// マーカーを生成
function createMarker(map, data, align) {
    'use strict';
    var title, color, origin, value, icon, marker, position;

    title = data.municipality;
    position = {
        lat: data.lat,
        lng: data.lng
    };
    value = data.value / 300000 * 50;

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

// データセットを非表示
function hideDataset(align) {
    'use strict';

    if (datasets[align]) {
        datasets[align].markers.forEach(function (marker) {
            marker.setMap(null);
        });
    }
}

// データセットを表示する
function displayDataset(map, datasetId, align) {
    'use strict';
    var marker, markers = [];

    // データを読んでマーカーを表示
    $.getJSON("/datasets/" + datasetId + ".json", function (dataset) {
        dataset.data.forEach(function (data) {
            marker = createMarker(map, data, align);
            markers.push(marker);
        });
    });
    datasets[align] = {datasetId: datasetId, markers: markers};
}

// Googleマップのライブラリの読み込み終了後に実行する内容
function initMap() {
    'use strict';
    var map, mapElement, prefectural = {};

    mapElement = $("#map");

    // マップの表示領域をリサイズする
    fitMapAreaToWindow();

    // 県庁所在地
    prefectural.capital = {lat: 40.824444, lng: 140.74};
    // 県の境界
    prefectural.bounds = {east: 141.683333, north: 41.556111, south: 40.217778, west: 139.496944};

    // マップの生成
    map = new google.maps.Map(mapElement[0], {
        center: prefectural.capital,
        zoom: 8
    });

    // マップの中心やズームを表示内容に合わせる
    map.fitBounds(prefectural.bounds);

    // データセットを読んで一覧を表示
    $.getJSON("/datasets.json", function (jsonArray) {

        jsonArray.forEach(function (json) {
            $("#dataset_select_0").append('<option value="' + json.id + '">' + json.name + '</option>');
            $("#dataset_select_1").append('<option value="' + json.id + '">' + json.name + '</option>');
        });

        $("#dataset_select_0").on('change', function () {
            var id_0 = $("[name=dataset_select_0]").val();
            $("#dataset_select_1 option").prop("disabled", false);
            hideDataset('left');
            if (id_0 !== "") {
                $("#dataset_select_1 option[value=" + id_0 + "]").prop("disabled", true);
                displayDataset(map, id_0, 'left');
            }
        });

        $("#dataset_select_1").on('change', function () {
            var id_1 = $("[name=dataset_select_1]").val();
            $("#dataset_select_0 option").prop("disabled", false);
            hideDataset('right');
            if (id_1 !== "") {
                $("#dataset_select_0 option[value=" + id_1 + "]").prop("disabled", true);
                displayDataset(map, id_1, 'right');
            }
        });

    });
}

$(document).ready(function () {
    'use strict';

    // ウィンドウサイズが変更された場合にマップの表示領域をリサイズする
    $(window).on('resize', fitMapAreaToWindow);
});
