class ActivityReportsController < ApplicationController
  before_action :set_activity_report, only: [:show, :update, :destroy]

  # GET /activity_reports
  # GET /activity_reports.json
  def index
    @activity_reports = ActivityReport.all

    render json: @activity_reports
  end

  # GET /activity_reports/1
  # GET /activity_reports/1.json
  def show
    render json: @activity_report
  end

  # POST /activity_reports
  # POST /activity_reports.json
  def create
    @activity_report = ActivityReport.new(activity_report_params)

    if @activity_report.save
      render json: @activity_report, status: :created, location: @activity_report
    else
      render json: @activity_report.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /activity_reports/1
  # PATCH/PUT /activity_reports/1.json
  def update
    @activity_report = ActivityReport.find(params[:id])

    if @activity_report.update(activity_report_params)
      head :no_content
    else
      render json: @activity_report.errors, status: :unprocessable_entity
    end
  end

  # DELETE /activity_reports/1
  # DELETE /activity_reports/1.json
  def destroy
    @activity_report.destroy

    head :no_content
  end

  private

    def set_activity_report
      @activity_report = ActivityReport.find(params[:id])
    end

    def activity_report_params
      params[:activity_report]
    end
end
