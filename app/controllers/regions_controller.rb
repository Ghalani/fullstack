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

  private
    def set_region
      @region = Region.find(params[:id])
    end
end
