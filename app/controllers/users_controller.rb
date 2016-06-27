class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]
  # creating a user doesn't require you to have an access token
  skip_before_filter :ensure_authenticated_user, :only => [:new, :create, :edit, :forgot_password, :reset_password]
  before_action :set_organization, only: [:index, :new_ap, :create_ap]

  layout 'admin', only: [:index]
  #organization's user list
  def index
    #@users = User.all
    if is_admin?
      @aps = @organization.managers
      @regions = @organization.regions
      render "organizations/views/users"
    else
      flash[:info] = "You are not the Admin of this administration"
      redirect_to "/"
    end
  end

  def show
    render json: @user
  end

  def new
    @user = User.new
  end

  def new_ap
    @user = User.new
    respond_to do |format|
      format.js
    end
  end

  def create_ap
    @user = User.new(user_params)
    @user.username = @user.fname+"."+@user.lname
    respond_to do |format|
      if @user.save
        @ap = AreaPlanner.new(user_id: @user.id, organization_id: @organization.id)
        if @ap.save
          # => send mail to @user.email to change their password
          UserMailer.ap_account_activation(@user).deliver_now
          flash[:info] = @user.fname+" "+@user.lname+" recieve an invite email soon"
          format.js
        else
          @user.destroy
          # => send message to front stating the issue
          format.js{ render :new_ap_error}
        end
      else
        # => send message to front stating the issue
        # => User email probably exist or some fields were missing
        format.js{ render :new_user_error}
      end
    end
  end

  def create
    @user = User.new(user_params)

    if @user.save
      # => create new org
      UserMailer.account_activation(@user).deliver_now
      flash[:info] = "Please check your email to activate your account."
      redirect_to "/organizations"
    else
      # => go back to signup form
      redirect_to :new
    end
  end

  def edit
    # @user = User.last
    # render "account_activations/first_reset"
  end

  def update
    @user = User.find(params[:id])

    if @user.update(user_params)
      if params[:logout]
        redirect_to "/logout"
      else
        head :no_content
      end
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy

    head :no_content
  end

  def password_reset
    @is_first = (@user.status == 'new')
    if @is_first
      render 'edit/new_password_reset'
    else
      #render
    end
  end

  def forgot_password
    @user = User.new
  end

  def reset_password
    @user = User.find_by_email(user_params[:email])
    if @user
      # => send email
      #UserMailer.password_reset(@user).deliver_now
      flash[:success] = "A password reset has been sent to your email."
      redirect_to "/login"
    else
      flash[:info] = "This email doesn't exist on our database."
      redirect_to "/accounts/forgot"
    end
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:fname, :lname, :status, :email, :password, :phone)
    end

    def set_organization
      begin
        @organization = Organization.find(params[:organization_id])
      rescue
        redirect_to '/'
      end
    end

    def is_admin?
      current_user.is_admin?(@organization.id)
    end
end
