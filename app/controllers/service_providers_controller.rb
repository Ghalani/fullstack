class ServiceProvidersController < ApplicationController
  before_action :set_organization
  layout 'admin'

  def index
    if is_admin?
      @sps = @organization.service_providers
      @regions = @organization.regions
      @teams = @organization.managers.collect{|m| m.teams}.flatten.uniq
      # => @teams = select a region to show a team
      render "organizations/views/labourers"
    elsif (Manager.where(user_id: current_user.id)) #is a manager
      @manager = Manager.find_by_id(params[:manager_id])
      #@regions = Manager.regions
    else
      flash[:info] = "You are not an admin"
      redirect_to "/"
    end
  end

  def show
    @sp = ServiceProvider.find_by_id(params[:id])
    respond_to do |f|
      f.js
    end
  end

  def new
    @region = Region.find(params[:region_id])
    @sp = ServiceProvider.new(region_id: @region.id)
  end

  def create
    @sp = ServiceProvider.new(service_provider_param)
    @sp.region = Region.find(params[:region_id])
    respond_to do |format|
      if @sp.save
        format.js
      else
        format.js{render "form_error"}
      end
    end
  end

  private
    def set_organization
      begin
        @organization = Organization.find(params[:organization_id])
      rescue
      end
    end
    def is_admin?
      current_user.is_admin?(@organization)
    end

    def service_provider_param
      params.require(:service_provider).permit(:fname, :lname, :phone, :gender, :image)
    end
end
