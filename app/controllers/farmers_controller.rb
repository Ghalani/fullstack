class FarmersController < ApplicationController
  def index
  end

  def show
    @farmer = Farmer.find(params[:id])
    respond_to do |format|
      format.js{ render layout:"fadein"}
      format.html
    end
  end

  def new
    set_organization_manager(params[:organization_id])
    @farmer = Farmer.new
    @regions = @organization.regions
    respond_to do |format|
      format.js{ render layout:"modal"}
    end
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

  private
  def farmer_params
	  params.require(:farmer).permit(:fname, :lname, :phone, :gender, :region_id, farm_ids:[])
	end
end
