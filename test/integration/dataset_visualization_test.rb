require 'test_helper'

class DatasetVisualizationTest < ActionDispatch::IntegrationTest
  def setup
    @dataset = datasets(:population)
  end

  test "links for dataset_path" do
    get dataset_path(@dataset)
    assert_template 'datasets/show'
    assert_select "a[href=?]", visualize_dataset_path(@dataset)
  end

  test "visualize display" do
    get visualize_dataset_path(@dataset)
    assert_template 'datasets/visualize'
  end
end
