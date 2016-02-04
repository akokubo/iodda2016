require 'test_helper'

class DatasetTest < ActiveSupport::TestCase
  def setup
    @dataset = Dataset.new(name: "1人当たり所得", author: "青森太郎", description: "青森県のオープンデータカタログサイトから取得したデータ")
  end

  test "should be valid" do
    assert @dataset.valid?
  end

  test "name should be preset" do
    @dataset.name = "     "
    assert_not @dataset.valid?
  end

  test "author should be preset" do
    @dataset.author = "     "
    assert_not @dataset.valid?
  end

  test "associated data should be destroyed" do
    @dataset.save
    @municipality = Municipality.create!(code: "022012", name: "青森", lat: 40.822222, lng: 140.7475)
    @dataset.data.create!(value: 2509, municipality_id: @municipality.id)
    assert_difference 'Datum.count', -1 do
      @dataset.destroy
    end
  end
end
