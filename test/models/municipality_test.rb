require 'test_helper'

class MunicipalityTest < ActiveSupport::TestCase
  def setup
    @municipality = Municipality.new(code: "022039", name: "八戸市")
  end

  test "should be valid" do
    assert @municipality.valid?
  end

  test "code should be preset" do
    @municipality.code = "     "
    assert_not @municipality.valid?
  end

  test "name should be preset" do
    @municipality.name = "     "
    assert_not @municipality.valid?
  end

  test "codes should be unique" do
    duplicate_municipality = @municipality.dup
    duplicate_municipality.name = "五所川原市"
    @municipality.save
    assert_not duplicate_municipality.valid?
  end

  test "names should be unique" do
    duplicate_municipality = @municipality.dup
    duplicate_municipality.code = "022055"
    @municipality.save
    assert_not duplicate_municipality.valid?
  end
end
