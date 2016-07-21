class AccountActivationsController < ApplicationController
  skip_before_filter :ensure_authenticated_user

  # => collect reset email  "/reset"
  def new
  end

  # => send reset
  def create
    @user = User.find_by_email(params[:email].downcase)
    if @user
      # => send email
      #UserMailer.password_reset(@user).deliver_now
      #@user.reset
      UserMailer.password_reset(@user).deliver_now
      flash[:info] = "A password reset will be sent to your email soon."
      redirect_to "/login"
    else
      flash[:info] = "This email doesn't exist on our database."
      render "new"
    end
  end

  def edit
    @user = User.find_by(email: params[:email])
    if (@user && !@user.activated? && @user.authenticated?(:activation, params[:id]))
      #log_in user
      session[:user_id] = @user.id
      if params[:isnew]
        # => when managers first login
        render "first_reset"
      else
        @user.update_attribute(:activated,    true)
        @user.update_attribute(:activated_at, Time.zone.now)
        flash[:success] = "Account activated!"
        redirect_to "/organizations"
      end
    elsif params[:reset] && @user.authenticated?(:activation, params[:id])
      # => normal reset
      render "password_reset"
    elsif @user.activated?
      flash[:success] = "Account is already activated!"
      redirect_to "/login"
    else
      flash[:danger] = "Invalid activation link"
      redirect_to root_url
    end
  end


end
