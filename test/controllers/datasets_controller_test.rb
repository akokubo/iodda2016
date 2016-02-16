require 'test_helper'

class DatasetsControllerTest < ActionController::TestCase
  def setup
    @base_title = "IODDA2016アプリ"
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should get compare" do
    get :compare
    assert_response :success
    assert_select "title", "2つのデータセットを比較 | #{@base_title}"
  end
end
