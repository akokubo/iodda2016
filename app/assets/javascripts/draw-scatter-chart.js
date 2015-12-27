/*jslint browser:true, devel:true */
/*global $, Flotr */

function drawScatterChart() {
  var horizontalData = [];
  var pieData = [];
  var xaxisLabels = [];
  var datum;
  var xaxisLabel;

  dataset.data.forEach(function (datum, idx) {
    horizontalData.push([datum.value, idx]);
    pieData.push({label: datum.municipality, data: [[0, datum.value]]});
    xaxisLabels.push([idx, datum.municipality]);
  });


  Flotr.draw(
    $("#horizontal-bars")[0],
    [horizontalData],
    {
      title: dataset.dataset,
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
        ticks: xaxisLabels
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


  Flotr.draw(
    $("#scatter-chart")[0],
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
  $(".flotr-dummy-div").parent().hide();
}
