require 'test_helper'

class DatasetTest < ActiveSupport::TestCase
  def setup
    @dataset = Dataset.new(name: "1人当たり所得")
  end

  test "should be valid" do
    assert @dataset.valid?
  end

  test "name should be preset" do
    @dataset.name = "     "
    assert_not @dataset.valid?
  end
end
