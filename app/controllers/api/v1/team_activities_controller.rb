module Api
  module V1
    class TeamActivitiesController < ApplicationController
      before_action :set_team_activty, only: [:show, :update, :destroy]

      # GET /team_activties
      # GET /team_activties.json
      def index
        @team_activties = TeamActivty.all

        render json: @team_activties
      end

      # GET /team_activties/1
      # GET /team_activties/1.json
      def show
        render json: @team_activty
      end

      # POST /team_activties
      # POST /team_activties.json
      def create
        @team_activty = TeamActivty.new(team_activty_params)

        if @team_activty.save
          render json: @team_activty, status: :created, location: @team_activty
        else
          render json: @team_activty.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /team_activties/1
      # PATCH/PUT /team_activties/1.json
      def update
        @team_activty = TeamActivty.find(params[:id])

        if @team_activty.update(team_activty_params)
          head :no_content
        else
          render json: @team_activty.errors, status: :unprocessable_entity
        end
      end

      # DELETE /team_activties/1
      # DELETE /team_activties/1.json
      def destroy
        @team_activty.destroy

        head :no_content
      end

      private

        def set_team_activty
          @team_activty = TeamActivty.find(params[:id])
        end

        def team_activty_params
          params[:team_activty]
        end
    end

  end
end
