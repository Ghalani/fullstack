class SessionsController < ApplicationController
  skip_before_filter :ensure_authenticated_user
  def new
    if current_user
      flash[:info] = "You are already logged in as #{current_user.email}"
    end
  end

  def create
    user = User.find_by_email(params[:email])
    if user && user.authenticate(params[:password])
      if user.activated
        session[:user_id] = user.id
        if user.role == "admin"
          #@organization = user.organizations.first
          redirect_to "/organizations", notice: 'Logged in'
        else
          # => to be tested
          redirect_to manager_path(user)
        end
      else
        flash[:info] = "Check your email and verify your account"
        redirect_to "/"
      end
    else
      render :new
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to "/", notice: 'Logged out'
  end
end
