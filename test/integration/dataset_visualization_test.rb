require 'test_helper'

class DatasetVisualizationTest < ActionDispatch::IntegrationTest
  def setup
    @dataset = datasets(:population)
  end

  test "links for dataset_path" do
    get dataset_path(@dataset)
    assert_template 'datasets/show'
    assert_select "a[href=?]", bars_chart_on_map_dataset_path(@dataset)
    assert_select "a[href=?]", choropleth_chart_dataset_path(@dataset)
    assert_select "a[href=?]", horizontal_bars_chart_dataset_path(@dataset)
    assert_select "a[href=?]", pie_chart_dataset_path(@dataset)
    assert_select "a[href=?]", d3pie_chart_dataset_path(@dataset)
  end

  test "bars_chart_on_map display" do
    get bars_chart_on_map_dataset_path(@dataset)
    assert_template 'datasets/bars_chart_on_map'
  end

  test "choropleth_chart display" do
    get choropleth_chart_dataset_path(@dataset)
    assert_template 'datasets/choropleth_chart'
  end

  test "horizontal_bars_chart display" do
    get horizontal_bars_chart_dataset_path(@dataset)
    assert_template 'datasets/horizontal_bars_chart'
  end

  test "pie_chart" do
    get pie_chart_dataset_path(@dataset)
    assert_template 'datasets/pie_chart'
  end

  test "d3pie_chart" do
    get d3pie_chart_dataset_path(@dataset)
    assert_template 'datasets/d3pie_chart'
  end
end
