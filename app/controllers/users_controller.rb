class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]
  # creating a user doesn't require you to have an access token
  #skip_before_filter :ensure_authenticated_user, :only => [:create]
  before_action :set_organization, only: [:index]

  layout 'admin', only: [:index]
  #organization's user list
  def index
    #@users = User.all
    @aps = AreaPlanner.where(organization_id: @organization.id)
    @regions = @organization.regions
  end

  def show
    render json: @user
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      # => create new org
      redirect_to 'organizations#new'
    else
      # => go back to signup form
      redirect_to :new
    end
  end

  def update
    @user = User.find(params[:id])

    if @user.update(user_params)
      head :no_content
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

  private

    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(:email, :password, :phone)
    end

    def set_organization
      begin
        @organization = Organization.find(params[:organization_id])
      rescue
        redirect_to '/'
      end
    end
end
