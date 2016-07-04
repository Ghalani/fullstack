class FarmersController < ApplicationController
  def index
  end

  def show
  end

  def new

  end

  def create
    @farmer = Farmer.new(farmer_params)
    respond_to do |format|
      if @farmer.save
        format.js
      else
        format.js{render "error"}
      end
    end
  end

  def assign_farmer
    @farm = Farm.find(params[:farm_id])
    @farmers = @farm.region.farmers # => for existing farmers
    @farmer = Farmer.new
    @manager = current_user.manager
    respond_to do |format|
      format.js
    end
  end

  private
  def farmer_params
	  params.require(:farmer).permit(:fname, :lname, :phone, :gender, farm_ids:[])
	end
end
