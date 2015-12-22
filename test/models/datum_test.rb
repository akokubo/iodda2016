require 'test_helper'

class DatumTest < ActiveSupport::TestCase

  def setup
    @dataset = datasets(:population)
    @municipality = municipalities(:aomori)
    @datum = @dataset.data.build(municipality_id: @municipality.id, value: 295683)
  end

  test "should be valid" do
    assert @datum.valid?
  end

  test "dataset id should be present" do
    @datum.dataset_id = nil
    assert_not @datum.valid?
  end

  test "municipality id should be present" do
    @datum.municipality_id = nil
    assert_not @datum.valid?
  end

  test "value should be present" do
    @datum.value = nil
    assert_not @datum.valid?
  end
end
