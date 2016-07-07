require 'test_helper'

class ActivityFormsControllerTest < ActionController::TestCase
  setup do
    @activity_form = activity_forms(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:activity_forms)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create activity_form" do
    assert_difference('ActivityForm.count') do
      post :create, activity_form: { name: @activity_form.name }
    end

    assert_redirected_to activity_form_path(assigns(:activity_form))
  end

  test "should show activity_form" do
    get :show, id: @activity_form
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @activity_form
    assert_response :success
  end

  test "should update activity_form" do
    patch :update, id: @activity_form, activity_form: { name: @activity_form.name }
    assert_redirected_to activity_form_path(assigns(:activity_form))
  end

  test "should destroy activity_form" do
    assert_difference('ActivityForm.count', -1) do
      delete :destroy, id: @activity_form
    end

    assert_redirected_to activity_forms_path
  end
end
