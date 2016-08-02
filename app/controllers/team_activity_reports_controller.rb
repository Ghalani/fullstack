class TeamActivityReportsController < ApplicationController
  def show
    @tar = TeamActivityReport.find(params[:id])
    respond_to do |format|
      format.js { render :layout => "modal"}
    end
  end
end
