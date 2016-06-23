class SessionsController < ApplicationController
  skip_before_filter :ensure_authenticated_user
  def new
  end

  def create
    user = User.find_by_email(params[:email])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      if user.organizations.first
        @organization = user.organizations.first
        redirect_to @organization, notice: 'Logged in'
      else
        if user.area_planner
          redirect_to 'area_planners#index'
        else
          redirect_to 'organizations#new'
        end
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
