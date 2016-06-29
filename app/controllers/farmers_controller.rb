class FarmersController < ApplicationController
  def index
  end

  def show
  end

  def new
  end

  def assign_farmer
    @farmer = Farmer.new
    @farm = Farm.find(params[:farm_id])
    respond_to do |format|
      format.js
    end
  end
end
