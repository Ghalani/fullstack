class FarmsController < ApplicationController
	before_action :set_organization
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
		@farmer = @farm.farmer
		@assps = []
		@teams = @farm.teams
		@teams.each do |t|
			@assps += ServiceProvider.includes(:team_assignments).where( :team_assignments => { :team_id => t.id })
		end
		@sps = ServiceProvider.where(region_id: @farm.region_id)
		if @organization && is_admin?
			render "organizations/views/farms/show"
		else
			respond_to do |format|
	  		format.js
				format.html
		  end
		end
	end

  def new
  	@farm = Farm.new
		@regions = Region.all
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

  private
  def farm_params
	  params.require(:farm).permit(:name, :area, :lat, :lon, :region_id)
	end

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
