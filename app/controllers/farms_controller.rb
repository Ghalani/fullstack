class FarmsController < ApplicationController

	def show
		@farm = Farm.find_by_id(params[:id])
		@teams = @farm.teams
		respond_to do |format|
  		format.js
	  end
	end

  def new
  	@farm = Farm.new
  	respond_to do |format|               
	    format.js
	  end 
  end

  def create
  	@farm = Farm.new(farm_params)
  	@farm.area_planner_id = 1
	  respond_to do |format|
  		if @farm.save                
		    format.js
		  else
		  	format.js{render "error"}
		  end 
  	end
  end

  private
  def farm_params
	  params.require(:farm).permit(:name, :area, :lat, :lon)
	end
end
