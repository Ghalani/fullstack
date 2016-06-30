class RegionsController < ApplicationController
  before_action :set_region, except: [:new, :create, :show_labour]

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

  def show_labour
    @region = Region.find(params[:region_id])
    @sps = @region.service_providers
    @teams = @sps.collect{|s| s.team_assignments.collect{|ta| ta.team}}.flatten.uniq
    #@regions = @sps.first.region.organization.regions ||= []
    respond_to do |format|
      format.js {render 'regions/js/show_labour'}
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
