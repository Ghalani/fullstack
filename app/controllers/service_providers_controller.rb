class ServiceProvidersController < ApplicationController
  before_action :set_organization
  layout 'admin'

  def index
    if is_admin?
      @sps = @organization.service_providers
      render "organizations/views/labourers"
    end
  end

  def show
    @sp = ServiceProvider.find_by_id(params[:id])
    respond_to do |f|
      f.js
    end
  end

  def new
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
end
