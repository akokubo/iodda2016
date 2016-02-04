/*jslint browser:true, devel:true */
/*global $, d3 */

var D3HorizontalBarsChart = {
    chart: null,
    barWidthMax: 50,
    xScale: null,
    barColor: '["rgb(224,243,219)", "rgb(67,162,202)"]',
    padding: 20,
    fontSize: 11,
    labelWidth: 66
};

// デフォルトのドメインをデータから導出
D3HorizontalBarsChart.getBarWidthMax = function () {
    'use strict';

    var barWidthMax;
    var width = D3HorizontalBarsChart.width;
    var padding = D3HorizontalBarsChart.padding;
    var labelWidth = D3HorizontalBarsChart.labelWidth;
    var fontSize = D3HorizontalBarsChart.fontSize;
    var xScale = D3HorizontalBarsChart.xScale;
    var min = xScale.domain()[0];
    var max = xScale.domain()[1];
    var digit;

    // 桁数を計算
    if (Math.abs(min) < Math.abs(max)) {
        digit = Math.abs(Math.log10(Math.abs(max)));
    } else {
        digit = Math.abs(Math.log10(Math.abs(min)));
    }

    barWidthMax = width - 2 * padding - digit * fontSize - labelWidth;

    return Math.floor(barWidthMax);
};

// デフォルトのドメインをデータから導出
D3HorizontalBarsChart.getDefaultDomainFromData = function (data) {
    'use strict';

    // データの最大最小値
    var min = d3.min(data, function (d) {
        return d.value;
    });

    var max = d3.max(data, function (d) {
        return d.value;
    });

    return [min, max];
};

// y軸スケールをドメインから計算
D3HorizontalBarsChart.getXScale = function (domain) {
    'use strict';

    var min = domain[0];
    var max = domain[1];
    var barWidthMax = D3HorizontalBarsChart.barWidthMax;

    console.log("min:" + min);
    console.log("max:" + max);
    console.log("barWidthMax:" + barWidthMax);
    var xScale = d3.scale.linear()
        .domain([min, max])
        .range([0, barWidthMax]);

    return xScale;
};

// グラフの書式設定を設定
D3HorizontalBarsChart.initPreferences = function (targetElement, dataset, defaultDomain) {
    'use strict';

    var dataMinElement = $(targetElement + " .data-min");
    var dataMaxElement = $(targetElement + " .data-max");
    var domainMinElement = $(targetElement + " .domain-min");
    var domainMaxElement = $(targetElement + " .domain-max");
    var barWidthMaxElement = $(targetElement + " .bar-width-max");
    var barColorElement = $(targetElement + " .bar-color");
    var xScale = D3HorizontalBarsChart.xScale;
    var barColor = D3HorizontalBarsChart.barColor;

    // 書式設定の数値の設定
    dataMinElement.val(defaultDomain[0]);
    dataMaxElement.val(defaultDomain[1]);

    domainMinElement.val(xScale.domain()[0]);
    domainMaxElement.val(xScale.domain()[1]);

    barColorElement.val(barColor.toString());

    // 書式設定のイベントハンドラの設定
    $('#chartPreferences').on('hidden.bs.modal', function () {
        var domainMin = parseInt(domainMinElement.val());
        var domainMax = parseInt(domainMaxElement.val());
        var colorJSON = JSON.parse('{ "barColor": ' + barColorElement.val() + "}");

        // 塗りの色の設定(http://colorbrewer2.org/で生成)
        D3HorizontalBarsChart.color = d3.scale.linear()
            .domain([domainMin, domainMax])
            .range(colorJSON.barColor);

        //D3HorizontalBarsChart.barColor = barColorElement.val();
        D3HorizontalBarsChart.barWidthMax = D3HorizontalBarsChart.getBarWidthMax();
        D3HorizontalBarsChart.xScale = D3HorizontalBarsChart.getXScale([domainMin, domainMax]);
        D3HorizontalBarsChart.xAxis = d3.svg.axis()
            .scale(D3HorizontalBarsChart.xScale)
            .orient("bottom");
        D3HorizontalBarsChart.redraw(dataset);
    });
};

// 棒グラフを表示する
D3HorizontalBarsChart.drawBars = function (data) {
    'use strict';

    var svg = D3HorizontalBarsChart.chart;
    var xScale = D3HorizontalBarsChart.xScale;
    var yScale = D3HorizontalBarsChart.yScale;
    var color = D3HorizontalBarsChart.color;
    var labelWidth = D3HorizontalBarsChart.labelWidth;

    console.log(color);
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function (d, i) {
            return yScale(i);
        })
        .attr("width", function (d) {
            console.log('d.value' + d.value);
            console.log('xScale(d.value)' + xScale(d.value));
            return xScale(d.value);
        })
        .attr("height", yScale.rangeBand())
        .attr("fill", function (d) {
            return color(d.value);
        })
        .attr("transform", "translate(" + labelWidth + ", 0)");
        console.log('labelWidth' + labelWidth);
};

// 棒グラフを表示する
D3HorizontalBarsChart.redrawBars = function (data) {
    'use strict';

    var svg = D3HorizontalBarsChart.chart;
    var xScale = D3HorizontalBarsChart.xScale;
    var yScale = D3HorizontalBarsChart.yScale;
    var color = D3HorizontalBarsChart.color;
    var labelWidth = D3HorizontalBarsChart.labelWidth;

    svg.selectAll("rect")
        .data(data)
        .attr("x", 0)
        .attr("y", function (d, i) {
            return yScale(i);
        })
        .attr("width", function (d) {
            console.log('d.value' + d.value);
            console.log('xScale(d.value)' + xScale(d.value));
            return xScale(d.value);
        })
        .attr("height", yScale.rangeBand())
        .attr("fill", function (d) {
            return color(d.value);
        })
        .attr("transform", "translate(" + (20 + labelWidth) + ", 0)");
        console.log('labelWidth' + labelWidth);
};

// スケールを表示する
D3HorizontalBarsChart.drawScale = function () {
    'use strict';

    var chartElement = D3HorizontalBarsChart.chartElement;
    var svg = D3HorizontalBarsChart.chart;
    var labelWidth = D3HorizontalBarsChart.labelWidth;
    var padding = D3HorizontalBarsChart.padding;
    var h = D3HorizontalBarsChart.height;
    var xAxis = D3HorizontalBarsChart.xAxis;

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (labelWidth - padding) + ", " + (h - padding * 2 + 2) + ")")
        .call(xAxis);

    svg.selectAll(chartElement + " .axis path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("shape-rendering", "crispEdges");

    svg.selectAll(chartElement + " .axis line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("shape-rendering", "crispEdges");

    svg.selectAll(chartElement + " .axis text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px");
};

// スケールを表示する
D3HorizontalBarsChart.redrawScale = function () {
    'use strict';

    var chartElement = D3HorizontalBarsChart.chartElement;
    var svg = D3HorizontalBarsChart.chart;
    var labelWidth = D3HorizontalBarsChart.labelWidth;
    var padding = D3HorizontalBarsChart.padding;
    var h = D3HorizontalBarsChart.height;
    var xAxis = D3HorizontalBarsChart.xAxis;

    svg.selectAll(chartElement + " .axis")
        .attr("transform", "translate(" + (20 + labelWidth - padding) + ", " + (h - padding * 2 + 2) + ")")
        .call(xAxis);

    svg.selectAll(chartElement + " .axis path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("shape-rendering", "crispEdges");

    svg.selectAll(chartElement + " .axis line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("shape-rendering", "crispEdges");

    svg.selectAll(chartElement + " .axis text")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px");
};

// 棒グラフの右に値を表示する
D3HorizontalBarsChart.drawValues = function (data) {
    'use strict';

    var svg = D3HorizontalBarsChart.chart;
    var xScale = D3HorizontalBarsChart.xScale;
    var yScale = D3HorizontalBarsChart.yScale;
    var labelWidth = D3HorizontalBarsChart.labelWidth;
    var chartElement = D3HorizontalBarsChart.chartElement;

    svg.selectAll(chartElement + " text.value")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "value")
        .text(function (d) {
            return d.value;
        })
        .attr("x", function (d) {
            return xScale(d.value) + 3;
        })
        .attr("y", function (d, i) {
            return yScale(i) + yScale.rangeBand() / 2 + 5;
        })
        .attr("transform", "translate(" + labelWidth + ", 0)");
};

// 棒グラフの右に値を表示する
D3HorizontalBarsChart.redrawValues = function (data) {
    'use strict';

    var svg = D3HorizontalBarsChart.chart;
    var xScale = D3HorizontalBarsChart.xScale;
    var yScale = D3HorizontalBarsChart.yScale;
    var labelWidth = D3HorizontalBarsChart.labelWidth;
    var chartElement = D3HorizontalBarsChart.chartElement;

    svg.selectAll(chartElement + " text.value")
        .data(data)
        .text(function (d) {
            return d.value;
        })
        .attr("x", function (d) {
            return xScale(d.value) + 3;
        })
        .attr("y", function (d, i) {
            return yScale(i) + yScale.rangeBand() / 2 + 5;
        })
        .attr("transform", "translate(" + (20 + labelWidth) + ", 0)");
};
// 棒グラフにラベルを追加する
D3HorizontalBarsChart.drawLabels = function (data) {
    'use strict';

    var svg = D3HorizontalBarsChart.chart;
    var yScale = D3HorizontalBarsChart.yScale;
    var labelWidth = D3HorizontalBarsChart.labelWidth;
    var fontSize = D3HorizontalBarsChart.fontSize;
    var chartElement = D3HorizontalBarsChart.chartElement;

    svg.selectAll(chartElement + " text.label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .text(function (d) {
            return d.municipality;
        })
        .attr("x", function (d) {
            return 0;
        })
        .attr("y", function (d, i) {
            return yScale(i) + yScale.rangeBand() / 2 + 5;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("text-anchor", "end")
        .attr("transform", "translate(" + (labelWidth - fontSize) + ", 0)");
};

D3HorizontalBarsChart.draw = function (dataset) {
    'use strict';

    var data = dataset.data;
    var valueMax;
    var svg;
    var padding;
    var w;
    var h;
    var labelWidth;
    var colorJSON;

    // 最大値を求める
    valueMax = d3.max(data, function (d) {
        return d.value;
    });

    padding = D3HorizontalBarsChart.padding;
    w = D3HorizontalBarsChart.width;
    h = D3HorizontalBarsChart.height;
    labelWidth = D3HorizontalBarsChart.labelWidth;

    // x軸のスケール
    D3HorizontalBarsChart.xScale = d3.scale.linear()
        .domain([0, valueMax])
        .range([padding, w - padding - Math.log10(valueMax) * 11 - labelWidth])
        .nice();

    D3HorizontalBarsChart.xAxis = d3.svg.axis()
        .scale(D3HorizontalBarsChart.xScale)
        .orient("bottom");

    colorJSON = JSON.parse('{ "barColor": ' + D3HorizontalBarsChart.barColor + " }");

    // 塗りの色の設定(http://colorbrewer2.org/で生成)
    D3HorizontalBarsChart.color = d3.scale.linear()
        .domain([0, valueMax])
        .nice()
        .range(
            colorJSON.barColor
        );

    // y軸のスケール
    D3HorizontalBarsChart.yScale = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeRoundBands([padding, h - padding], 0.05);

    // SVG要素を作る
    svg = d3.select(D3HorizontalBarsChart.chartElement)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    D3HorizontalBarsChart.chart = svg;

    D3HorizontalBarsChart.drawBars(data);
    D3HorizontalBarsChart.drawScale();
    D3HorizontalBarsChart.drawValues(data);
    D3HorizontalBarsChart.drawLabels(data);
};

D3HorizontalBarsChart.redraw = function (dataset) {
    'use strict';

    console.log("redraw");
    var data = dataset.data;
    D3HorizontalBarsChart.redrawBars(data);
    D3HorizontalBarsChart.redrawScale();
    D3HorizontalBarsChart.redrawValues(data);
};

D3HorizontalBarsChart.init = function (targetElement, chartElement, dataset) {
    'use strict';

    var data = dataset.data;
    var defaultDomain;

    // デフォルトのドメインを導出
    defaultDomain = D3HorizontalBarsChart.getDefaultDomainFromData(data);

    // デフォルトのスケールを導出
    D3HorizontalBarsChart.xScale = D3HorizontalBarsChart.getXScale(defaultDomain);
    D3HorizontalBarsChart.xScale.nice();
    var domainMin = D3HorizontalBarsChart.xScale.domain()[0];
    var domainMax = D3HorizontalBarsChart.xScale.domain()[1];

    D3HorizontalBarsChart.width = $(chartElement).width();
    D3HorizontalBarsChart.height = $(chartElement).innerHeight();
    D3HorizontalBarsChart.barWidthMax = D3HorizontalBarsChart.getBarWidthMax();
    D3HorizontalBarsChart.xScale = D3HorizontalBarsChart.getXScale([domainMin, domainMax]);

    // 描画要素の設定
    D3HorizontalBarsChart.chartElement = chartElement;

    // グラフの書式設定を設定
    D3HorizontalBarsChart.initPreferences(targetElement, dataset, defaultDomain);

    //D3HorizontalBarsChart.chart = null;
    D3HorizontalBarsChart.draw(dataset);
};
