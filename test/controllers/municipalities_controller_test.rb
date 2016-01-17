require 'test_helper'

class MunicipalitiesControllerTest < ActionController::TestCase
  setup do
    @municipality = municipalities(:aomori)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:municipalities)
  end
end
