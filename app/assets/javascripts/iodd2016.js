/*jslint browser:true, devel:true */
/*global google, $ */

function initMap() {
    'use strict';

    var mapElement = $("#map");
    var map;
    var prefectural = {};

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

    // マップの表示領域を調整
    map.fitBounds(prefectural.bounds);

    $.getJSON("/municipalities.json", function (municipalities) {
        var i;
        for (i = 0; i < municipalities.length; i += 1) {
            createMarker(map, municipalities[i]);
        }
    });
}

// マーカーを生成
function createMarker(map, municipality) {
    title = municipality.name;
    position = {
        lat: municipality.lat,
        lng: municipality.lng
    };
    new google.maps.Marker({position: position, map: map, title: title});
}

// マップ表示領域の高さを画面に合わせる
function fitMapAreaToWindow() {
    var mapElement = $("#map");
    var mapElementTop = mapElement.offset().top;
    var footerTop = $("#footer").offset().top;
    var debugDumpHeight = $(".debug_dump").outerHeight(true);
    var mapElementHeight = footerTop - mapElementTop - debugDumpHeight - 45;
    mapElement.height(mapElementHeight);
}

$(document).ready(function () {
    $(window).on('resize', fitMapAreaToWindow)
});
