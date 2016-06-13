class TeamsController < ApplicationController
  def new
    @team = Team.new
    @farm = Farm.find_by_id(params[:farm_id])
    @team.farm = @farm
  	respond_to do |format|
	    format.js
	  end
  end

  def show
    @team = Team.find_by_id(params[:id])
    @sps = @team.service_providers
    @av_sps = ServiceProvider.includes(:teams).where( :teams => { :id => nil }, region: @team.farm.region_id )
    respond_to do |format|
      format.js
    end
  end

  def create
    @team = Team.new(team_params)
    @team.farm_id = params[:farm_id]
    @team.area_planner_id = 1
    if @team.save
      respond_to do |f|
        f.js
      end
    end
  end

  private
  def team_params
	  params.require(:team).permit(:name, :farm_id)
	end
end
