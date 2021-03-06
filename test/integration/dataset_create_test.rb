require 'test_helper'

class DatasetCreateTest < ActionDispatch::IntegrationTest
  test "invalid dataset if name absence" do
    get new_dataset_path
    assert_no_difference 'Dataset.count' do
      post datasets_path, dataset: {
        name: ""
      }
    end
    assert_template 'datasets/new'
  end

  test "invalid dataset if author absence" do
    get new_dataset_path
    assert_no_difference 'Dataset.count' do
      post datasets_path, dataset: {
        author: ""
      }
    end
    assert_template 'datasets/new'
  end

  test "valid dataset information" do
    get new_dataset_path
    assert_difference 'Dataset.count', 1 do
      post_via_redirect datasets_path, dataset: {
        name: "1人当たり所得",
        author: "青森太郎",
        description: "青森県のオープンデータカタログサイトから取得したデータ",
        file: fixture_file_upload('/csv/work_force_2012.csv', 'text/comma-separated-values')
      }
    end
    assert_template 'datasets/show'
  end
end
