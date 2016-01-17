/*jslint devel:true, browser:true */
/*global $, d3, google */

var DrawD3GoogleMapsGeoJSONChart = {};

DrawD3GoogleMapsGeoJSONChart.init = function (targetElement, mapElement, dataset, geojson) {
    'use strict';
    var map, max, styleFeature, data, dataSettlement, dataValue, i, j, jsonSettlement;

    data = dataset.data;

    map = new google.maps.Map($(mapElement)[0], {
        zoom: 9,
        center: {lat: 41.0121782, lng: 140.6787885}
    });

    max = d3.max(data, function (d) {
        return d.value;
    });

    //ポリゴンデータのスタイルを指定
    styleFeature = function (max) {
        //カラースケールを指定
        var colorScale = d3.scale.quantize()
            .range(['rgb(255,255,229)', 'rgb(247,252,185)', 'rgb(217,240,163)', 'rgb(173,221,142)', 'rgb(120,198,121)', 'rgb(65,171,93)', 'rgb(35,132,67)', 'rgb(0,104,55)', 'rgb(0,69,41)'])
            .domain([0, max]);

        return function (feature) {
            return {
                strokeWeight: 1,
                strokeColor: 'gray',
                strokeOpcity: 0.4,
                zIndex: 4,
                fillColor: colorScale(feature.getProperty('value')),
                fillOpacity: 0.75,
                visible: true
            };
        };
    };

    i = 0;
    while (i < data.length) {
        dataSettlement = data[i].municipality;
        dataValue = parseFloat(data[i].value);
        j = 0;
        while (j < geojson.features.length) {
            jsonSettlement = geojson.features[j].properties.N03_004;
            jsonSettlement = jsonSettlement.replace("六ケ所村", "六ヶ所村");
            if (dataSettlement === jsonSettlement) {
                geojson.features[j].properties.value = dataValue;
            }
            j += 1;
        }
        i += 1;
    }

    map.data.addGeoJson(geojson);
    map.data.setStyle(styleFeature(max));
};
