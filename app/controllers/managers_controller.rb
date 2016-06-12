class ManagersController < ApplicationController
  layout 'dashboard'
  def show
  	@id = params[:id]
  	@farms = Farm.all;
  end
end
