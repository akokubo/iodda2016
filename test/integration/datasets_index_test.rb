require 'test_helper'

class DatasetsIndexTest < ActionDispatch::IntegrationTest
  test "index including pagination" do
    get datasets_path
    assert_template 'datasets/index'
    assert_select 'tbody tr'
    Dataset.all.each do |dataset|
      assert_select 'td', dataset.name
      assert_select 'a[href=?]', dataset_path(dataset), text: "詳細表示"
    end
  end
end
