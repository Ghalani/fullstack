class RegionsController < ApplicationController
  before_action :set_region, except: [:new, :create, :show_labour]

  def new
    @region = Region.new
    @organization = Organization.find(params[:organization_id])
    @region.organization_id = @organization.id
    @region.country_id = @organization.country_id
    respond_to do |format|
      format.js
    end
  end

  def show
    @farms = @region.farms
    @sps = @region.service_providers
    @manager = Manager.where(user_id: current_user.id, organization_id: @region.organization_id).first
    respond_to do |format|
      format.js
    end
  end

  def show_labour
    @region = Region.find(params[:region_id])
    @sps = @region.service_providers
    @teams = @region.teams
    #@regions = @sps.first.region.organization.regions ||= []
    respond_to do |format|
      format.js {render 'regions/js/show_labour'}
    end
  end

  def create
    @region = Region.new(region_params)
    @region.organization_id = params[:organization_id]
    respond_to do |format|
      if @region.save
        format.js
      else
        format.js{render "new_error"}
      end
    end
  end

  private
    def set_region
      @region = Region.find(params[:id])
    end

    def region_params
      params.require(:region).permit(:name, :lat, :lon, :country_id)
    end
end
