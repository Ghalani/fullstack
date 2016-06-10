class AreaPlannersController < ApplicationController
  before_action :set_area_planner, only: [:show, :update, :destroy]

  # GET /area_planners
  # GET /area_planners.json
  def index
    @area_planners = AreaPlanner.all

    render json: @area_planners
  end

  # GET /area_planners/1
  # GET /area_planners/1.json
  def show
    render json: @area_planner
  end

  # POST /area_planners
  # POST /area_planners.json
  def create
    @area_planner = AreaPlanner.new(area_planner_params)

    if @area_planner.save
      render json: @area_planner, status: :created, location: @area_planner
    else
      render json: @area_planner.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /area_planners/1
  # PATCH/PUT /area_planners/1.json
  def update
    @area_planner = AreaPlanner.find(params[:id])

    if @area_planner.update(area_planner_params)
      head :no_content
    else
      render json: @area_planner.errors, status: :unprocessable_entity
    end
  end

  # DELETE /area_planners/1
  # DELETE /area_planners/1.json
  def destroy
    @area_planner.destroy

    head :no_content
  end

  private

    def set_area_planner
      @area_planner = AreaPlanner.find(params[:id])
    end

    def area_planner_params
      params[:area_planner]
    end
end
