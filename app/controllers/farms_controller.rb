class FarmsController < ApplicationController
	before_action :set_organization, only:[:index, :show, :new]
	before_action :set_manager, except:[:show, :index]
	layout 'admin'
	def index
		if @organization && is_admin?
			@farms = @organization.farms

      render "organizations/views/farms"
    else
      flash[:info] = "You are not authorized to view this Organization"
      redirect_to "/"
    end
	end

	def show
		@farm = Farm.find_by_id(params[:id])
		@assps = []
		@teams = @farm.teams
		# @assps += ServiceProvider.includes(:team_assignments).where( :team_assignments => { :team_id => t.id })
		@assps = @teams.collect{|t|
			t.team_assignments.collect{|ta|
				ta.service_provider
			}
		}.flatten.uniq
		@sps = ServiceProvider.where(region_id: @farm.region_id)
		if @organization && is_admin?
			@manager = Manager.where(user_id: @organization.user_id, organization_id: @organization.id).first
			@is_org = true
		else
			set_manager
			respond_to do |format|
	  		format.js
				format.html
		  end
		end
	end

  def new
		@farm = Farm.new
		@regions = Region.all
		# if @organization && is_admin?
		# 	@manager = Manager.where(user_id: @organization.user_id, organization_id: @organization.id).first
		# else
		# 	set_manager
		# end
		@manager = Manager.find(params[:manager_id])
		@farm.manager = @manager
  	respond_to do |format|
	    format.js
	  end
  end

  def create
  	@farm = Farm.new(farm_params)
  	@farm.manager_id = 1
		#@farm.region_id = rand(1..2)
	  respond_to do |format|
  		if @farm.save
		    format.js
		  else
		  	format.js{render "error"}
		  end
  	end
  end

	def update
		@farm = Farm.find(params[:id])
	  respond_to do |format|
  		if @farm.update_attributes(farm_params)
		    format.js
		  else
		  	format.js{render "error"}
		  end
  	end
	end

	def assign_teams
    @farm = Farm.find(params[:farm_id])
    @teams = @farm.teams
    @remaining_teams = @farm.region.teams - @teams
    respond_to do |format|
			puts "#"*100; puts @farm.name
      format.js
    end
  end

  private
  def farm_params
	  params.require(:farm).permit(:name, :area, :lat, :lon, :region_id, :farmer_id, :manager_id)
	end

	def set_organization
		begin
			@organization = Organization.find(params[:organization_id])
		rescue
		end
	end

	def set_manager
		begin
			@manager = Manager.find(params[:manager_id])
		rescue
		end
	end

	def is_admin?
		current_user.is_admin?(@organization)
	end
end
