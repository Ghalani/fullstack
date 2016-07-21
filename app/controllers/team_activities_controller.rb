class TeamActivitiesController < ApplicationController
  before_action :set_region

  def new
    @team_activity = TeamActivity.new
    @teams = @region.teams
    @farms = @region.farms
    @activities = @region.organization.activities
    respond_to do |format|
      format.js
    end
  end

  def create
    @team_activity = TeamActivity.new(team_activity_params)
    respond_to do |format|
      if @team_activity.save
        # refresh
        @sp = @team_activity.team.leader
        TwilioSmsService.new.send(@sp.formated_numb, "Hey #{@sp.fl_name}, your team (#{@team_activity.team.name}) has a new task, Login to the Ghalani app and get the details")
        flash[:success] = "Team activity created"
        format.js
      else
        # show error
        format.js{render "error"}
      end
    end
  end

  private
    def set_region
      @region = Region.find(params[:region_id])
    end

    def team_activity_params
      params.require(:team_activity).permit(:activity_id, :farm_id, :team_id, :start_date, :end_date, :comment)
    end
end
