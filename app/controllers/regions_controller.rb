class RegionsController < ApplicationController
  before_action :set_region, only: [:show, :edit, :update, :destroy]
  def new
    @region = Region.new
    @region.organization_id = params[:organization_id]
    respond_to do |format|
      format.js
    end
  end

  def show
    @farms = @region.farms
    respond_to do |format|
      format.js
    end
  end

  def create
    @region = Region.new(region_params)
    @region.organization_id = params[:organization_id]
    if @region.save
      redirect_to region.organization
    else
      respond_to do |format|
        format.js{render "new_error"}
      end
    end
  end

  private
    def set_region
      @region = Region.find(params[:id])
    end

    def region_params
      params.require(:region).permit(:name, :lat, :lon)
    end
end
