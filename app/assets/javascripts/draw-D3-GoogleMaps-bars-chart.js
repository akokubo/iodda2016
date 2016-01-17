/*jslint browser:true, devel:true, this:true */
/*global google, $, d3 */

var D3GoogleMapsBarsChart = {
    displayGoogleMap: true,
    map: null,
    markers: [],
    barHeightMax: 50,
    yScale: null,
    barColor: "rgba(255, 0, 0, 0.8)"
};

// マーカーを生成
D3GoogleMapsBarsChart.createMarker = function (datum, options) {
    'use strict';

    var map = D3GoogleMapsBarsChart.map,
        marker,
        icon,
        infoWindow,
        barHeight,
        xOrigin = 0,
        yScale = D3GoogleMapsBarsChart.yScale,
        title = datum.municipality,
        position = {
            lat: datum.lat,
            lng: datum.lng
        };

    // アイコンのデフォルト値の設定
    if (options !== undefined) {
        icon = options;
    } else {
        icon = {};
    }

    icon.fillColor = icon.fillColor || D3GoogleMapsBarsChart.barColor;
    icon.fillOpacity = icon.fillOpacity || 0.8;
    icon.opacity = icon.fillOpacity || 0.8;
    icon.scale = icon.scale || 1;
    icon.strokeColor = icon.strokeColor || 'black';
    icon.strokeWeight = icon.strokeWeight || 1;

    // 棒グラフの形状
    barHeight = yScale(datum.value);
    icon.path = 'M ' + xOrigin + ',' + (-1 * barHeight)
            + ' v ' + barHeight // 右の縦線
            + ' a 5 3 0 0 1 -10,0' // 下の円弧
            + ' v ' + (-1 * barHeight) // 左の縦線
            + 'M ' + xOrigin + ',' + (-1 * barHeight)
            + ' a 5 3 0 0 1 -10,0 a 5 3 180 0 1 10,0'; // 上の楕円

    // マーカーの生成
    marker = new google.maps.Marker({
        map: map,
        position: position,
        icon: icon,
        title: title
    });

    // 情報ウィンドウの生成
    infoWindow = new google.maps.InfoWindow({content: title + '<br>' + datum.value});

    // マーカーにイベントリスナーを設定
    marker.addListener('mouseover', function () {
        infoWindow.open(map, marker);
    });
    marker.addListener('mouseout', function () {
        infoWindow.close();
    });

    return marker;
};

// 全マーカーを削除
D3GoogleMapsBarsChart.removeMarkers = function (markers) {
    'use strict';

    markers.forEach(function (marker) {
        marker.setMap(null);
    });

    markers = [];
    return markers;
};

// デフォルトのドメインをデータから導出
D3GoogleMapsBarsChart.getDefaultDomainFromData = function (data) {
    'use strict';

    var min, max;

    // データの最大最小値
    min = d3.min(data, function (d) {
        return d.value;
    });

    max = d3.max(data, function (d) {
        return d.value;
    });

    return [min, max];
};

// y軸スケールをドメインから計算
D3GoogleMapsBarsChart.getYScale = function (domain) {
    'use strict';

    var min = domain[0],
        max = domain[1],
        barHeightMax = D3GoogleMapsBarsChart.barHeightMax,
        yScale;

    yScale = d3.scale.linear()
        .domain([min, max])
        .range([0, barHeightMax]);

    return yScale;
};

// データセットを再表示
D3GoogleMapsBarsChart.redraw = function (dataset) {
    'use strict';

    var data = dataset.data,
        markers = D3GoogleMapsBarsChart.markers,
        marker;

    if (D3GoogleMapsBarsChart.displayGoogleMap === true) {
        D3GoogleMapsBarsChart.removeMarkers(markers);

        data.forEach(function (datum) {
            marker = D3GoogleMapsBarsChart.createMarker(datum);
            markers.push(marker);
        });
    }
    D3GoogleMapsBarsChart.markers = markers;
};

// データセットを表示
D3GoogleMapsBarsChart.draw = function (dataset) {
    'use strict';

    var data = dataset.data,
        markers = D3GoogleMapsBarsChart.markers,
        marker;

    if (D3GoogleMapsBarsChart.displayGoogleMap === true) {
        data.forEach(function (datum) {
            marker = D3GoogleMapsBarsChart.createMarker(datum);
            markers.push(marker);
        });
    }

    D3GoogleMapsBarsChart.markers = markers;
};

// Googleマップのライブラリの読み込み終了後に実行する内容
D3GoogleMapsBarsChart.createMap = function (mapElement) {
    'use strict';

    var map,
        prefectural = {};

    // 県庁所在地
    prefectural.capital = {lat: 40.824444, lng: 140.74};

    // 県の境界
    prefectural.bounds = {east: 141.683333, north: 41.556111, south: 40.217778, west: 139.496944};

    // マップの生成
    map = new google.maps.Map($(mapElement)[0], {
        center: prefectural.capital,
        zoom: 8
    });

    // マップの中心やズームを表示内容に合わせる
    map.fitBounds(prefectural.bounds);

    D3GoogleMapsBarsChart.map = map;
};

// グラフの書式設定を設定
D3GoogleMapsBarsChart.initPreferences = function (targetElement, dataset, defaultDomain) {
    'use strict';

    var dataMinElement = $(targetElement + " .data-min"),
        dataMaxElement = $(targetElement + " .data-max"),
        domainMinElement = $(targetElement + " .domain-min"),
        domainMaxElement = $(targetElement + " .domain-max"),
        barHeightMaxElement = $(targetElement + " .bar-height-max"),
        barColorElement = $(targetElement + " .bar-color"),
        yScale = D3GoogleMapsBarsChart.yScale,
        barHeightMax = D3GoogleMapsBarsChart.barHeightMax,
        barColor = D3GoogleMapsBarsChart.barColor;

    // 書式設定の数値の設定
    dataMinElement.val(defaultDomain[0]);
    dataMaxElement.val(defaultDomain[1]);

    domainMinElement.val(yScale.domain()[0]);
    domainMaxElement.val(yScale.domain()[1]);

    barHeightMaxElement.val(barHeightMax);
    barColorElement.val(barColor);

    // 書式設定のイベントハンドラの設定
    $('#chartPreferences').on('hidden.bs.modal', function () {
        var domainMin = domainMinElement.val(),
            domainMax = domainMaxElement.val();

        D3GoogleMapsBarsChart.barColor = barColorElement.colorpicker('getValue');
        D3GoogleMapsBarsChart.barHeightMax = barHeightMaxElement.val();
        D3GoogleMapsBarsChart.yScale = D3GoogleMapsBarsChart.getYScale([domainMin, domainMax]);
        D3GoogleMapsBarsChart.redraw(dataset);
    });
};

// データセット比較の初期化
D3GoogleMapsBarsChart.init = function (targetElement, mapElement, dataset) {
    'use strict';

    var data = dataset.data,
        defaultDomain;

    // デフォルトのドメインを導出
    defaultDomain = D3GoogleMapsBarsChart.getDefaultDomainFromData(data);

    // デフォルトのスケールを導出
    D3GoogleMapsBarsChart.yScale = D3GoogleMapsBarsChart.getYScale(defaultDomain).nice();

    // グラフの書式設定を設定
    D3GoogleMapsBarsChart.initPreferences(targetElement, dataset, defaultDomain);

    // Googleマップの表示
    if (D3GoogleMapsBarsChart.displayGoogleMap === true) {
        D3GoogleMapsBarsChart.createMap(mapElement);
        D3GoogleMapsBarsChart.draw(dataset);
    }

    // カラーピッカーの設定
    $(targetElement + " .bar-color input").val(D3GoogleMapsBarsChart.barColor);
    $(targetElement + " .bar-color").colorpicker();
};
