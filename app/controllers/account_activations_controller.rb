class AccountActivationsController < ApplicationController
  skip_before_filter :ensure_authenticated_user

  def edit
    user = User.find_by(email: params[:email])
    if user && !user.activated? && user.authenticated?(:activation, params[:id])
      user.update_attribute(:activated,    true)
      user.update_attribute(:activated_at, Time.zone.now)
      #log_in user
      session[:user_id] = user.id
      flash[:success] = "Account activated!"
      if params[:isnew]
        render "first_reset"
      else
        redirect_to "/organizations"
      end
    elsif user.activated?
      flash[:success] = "Account is already activated!"
      redirect_to "/login"
    else
      flash[:danger] = "Invalid activation link"
      redirect_to root_url
    end
  end


end
