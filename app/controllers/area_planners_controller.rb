class AreaPlannersController < ApplicationController
  layout 'dashboard'
  def show
    @id = params[:id]
    @farms = Farm.where(area_planner_id: @id);
  end
end
