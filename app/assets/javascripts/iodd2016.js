/*jslint browser:true, devel:true */
/*global google, $, window */

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
function createMarker(map, data) {
    'use strict';
    var title, position, value, icon, marker;

    title = data.municipality;
    position = {
        lat: data.lat,
        lng: data.lng
    };
    value = data.value / 300000 * 50;
    icon = {
        path: 'M 5,' + (-1 * value) + ' v ' + value + ' a 5 3 0 0 1 -10,0 v ' + (-1 * value) + ' M 5,' + (-1 * value) + ' a 5 3 0 0 1 -10,0 a 5 3 180 0 1 10,0',
        fillColor: 'red',
        fillOpacity: 0.8,
        scale: 1,
        strokeColor: 'black',
        strokeWeight: 1
    };

    marker = new google.maps.Marker({map: map, position: position, icon: icon, title: title});
    return marker;
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

    // データを読んでマーカーを表示
    $.getJSON("/datasets/1.json", function (dataset) {
        var i = 0;
        while (i < dataset.data.length) {
            createMarker(map, dataset.data[i]);
            i = i + 1;
        }
    });
}

$(document).ready(function () {
    'use strict';

    // ウィンドウサイズが変更された場合にマップの表示領域をリサイズする
    $(window).on('resize', fitMapAreaToWindow);
});
