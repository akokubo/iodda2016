require 'test_helper'

class DatasetCreateTest < ActionDispatch::IntegrationTest
  test "invalid dataset information" do
    get new_dataset_path
    assert_no_difference 'Dataset.count' do
      post datasets_path, dataset: {
        name: ""
      }
    end
    assert_template 'datasets/new'
  end

  test "valid dataset information" do
    get new_dataset_path
    assert_difference 'Dataset.count', 1 do
      post_via_redirect datasets_path, dataset: {
        name: "1人当たり所得"
      }
    end
    assert_template 'datasets/show'
  end
end
