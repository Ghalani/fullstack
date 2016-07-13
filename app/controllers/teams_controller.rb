class TeamsController < ApplicationController
  before_action :set_organization, only:[:new]
  layout 'admin'
  def new
    @team = Team.new
    # @farm = Farm.find_by_id(params[:farm_id])
    # @team.farm = @farm

    if(@organization)
      @manager = Manager.where(user_id: @organization.user_id, organization_id: @organization.id).first
    else
      @manager = Manager.find(params[:manager_id])
    end
    @region = Region.find(params[:region])
    # @farms = @region.farms
    # @sps = @region.service_providers
    @team.region = @region
    @team.manager = @manager if @manager
  	respond_to do |format|
	    format.js
	  end
  end

  def show
    @manager = Manager.find(params[:manager_id])
    @team = Team.find_by_id(params[:id])
    @leader = @team.leader
    @farms = @team.farms
    @remaining_farms = @team.region.farms - @farms
    #@sps = @team.team_assignments.service_providers
    @sps = ServiceProvider.includes(:team_assignments).where( :team_assignments => { :team_id => @team.id })
    @av_sps = ServiceProvider.includes(:team_assignments).where( :team_assignments => { :id => nil }, region: @team.region_id )
    @upc_tact = TeamActivity.where("start_date > ?", Time.now)
    @act_tact = TeamActivity.where("(start_date <= ?) AND (end_date > ?)", Time.now, Time.now)
    @old_tact = TeamActivity.where("end_date < ?", Time.now)
    # @activities = Activity.all
    respond_to do |format|
      format.js   # => preview
      format.html # => fullview
    end
  end

  def create
    @team = Team.new(team_params)
    # @team.farm_id = params[:farm_id]
    @manager = Manager.find(params[:manager_id])
    @team.manager = @manager
    if @team.save
      respond_to do |f|
        f.js
      end
    end
  end

  def assign_farms
    @team = Team.find(params[:team_id])
    @farms = @team.farms
    @remaining_farms = @team.region.farms - @farms
    respond_to do |format|
      format.js
    end
  end

  def add_service_provider
    @team = Team.find_by_id(params[:id])
    @sp = ServiceProvider.find_by_id(params[:id])
    respond_to do |f|
      if @team.add_sp(sp)
        f.js
      else
        f.js{render 'error'}
      end
    end
  end

  def update
    @team = Team.find_by_id(params[:id])
    respond_to do |format|
      if @team.update(team_params)
        # refresh page
        format.js
      else
        # => send error msg
        format.js{render 'error'}
      end
    end

  end

  def new_team_lead
    @team = Team.find(params[:team_id])
    @manager = Manager.find(params[:manager_id])
    @leader = @team.leader
    @sps = ServiceProvider.includes(:team_assignments).where( :team_assignments => { :team_id => @team.id })
    respond_to do |format|
      format.js
    end
  end

  private
  def set_organization
    @organization = Organization.find(params[:organization_id])
  end

  def team_params
	  params.require(:team).permit(:name, :region_id, :manager_id, :leader_id)
	end
end
