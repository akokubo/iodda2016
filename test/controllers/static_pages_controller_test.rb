require 'test_helper'

class StaticPagesControllerTest < ActionController::TestCase
  def setup
    @base_title = "IODDA2016アプリ"
  end

  test "should get home" do
    get :home
    assert_response :success
    assert_select "title", "#{@base_title}"
  end

  test "should get help" do
    get :help
    assert_response :success
    assert_select "title", "ヘルプ | #{@base_title}"
  end

  test "should get about" do
    get :about
    assert_response :success
    assert_select "title", "アプリについて | #{@base_title}"
  end
end
