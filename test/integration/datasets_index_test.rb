require 'test_helper'

class DatasetsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @dataset = datasets(:population)
  end

  test "index including delete links" do
    get datasets_path
    assert_template 'datasets/index'
    assert_select 'tbody tr'
    Dataset.all.each do |dataset|
      assert_select 'td', dataset.name
      assert_select 'a[href=?]', dataset_path(dataset), text: "データの表示"
      assert_select 'a[href=?]', dataset_path(dataset), text: "削除"
    end
    assert_difference 'Dataset.count', -1 do
      delete dataset_path(@dataset)
    end
  end

end
