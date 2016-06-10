class ManagersController < ApplicationController
  def show
  	@id = params[:id]
  	@farms = Farm.all;
  end
end
