class SessionsController < ApplicationController
  skip_before_filter :ensure_authenticated_user
  def new
  end

  def create
    user = User.find_by_email(params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      if user.role == "admin"
        #@organization = user.organizations.first
        redirect_to "/organizations", notice: 'Logged in'
      else
        redirect_to manager_path(user)
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
