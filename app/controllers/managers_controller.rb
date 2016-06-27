class ManagersController < ApplicationController
  before_action :set_manager, only:[:show]
  before_action :auth_manager, only:[:show]

  layout 'dashboard'
  def show
    @farms = Farm.where(manager_id: @manager.id);
  end

  def set_manager
    @manager = Manager.find_by_id(params[:id])
  end

  def auth_manager
    unless @manager && (@manager.user == current_user)
      flash[:error] = "Unauthorized entry, please login with the right account"
      redirect_to "/"
    end
  end
end
