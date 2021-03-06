module Api
  module V1
    class TeamsController < ApplicationController
      before_action :set_team, only: [:show, :update, :destroy]
      skip_before_filter :ensure_authenticated_user, only:[:show]

      # GET /teams
      # GET /teams.json

      def index
        @teams = Team.all

        render json: @teams
      end

      # GET /teams/1
      # GET /teams/1.json
      def show
        @team = Team.find(params[:id])
        @sp = @team.leader
        if @sp.access_token == params[:access_token]
          # host/api/v1/teams/[id]?access_token=2345678
          render json: @team
        else
          render json: { error: "Unauthorized, your API key is invalid"}
        end
      end

      # POST /teams
      # POST /teams.json
      def create
        @team = Team.new(team_params)

        if @team.save
          render json: @team, status: :created, location: @team
        else
          render json: @team.errors, status: :unprocessable_entity
        end
      end

      def add_farm
        @team = Team.find_by(id: params[:team_id])
        if @team
          @farm = Farm.find_by(id: params[:farm_id])
          if @farm
            begin
              @team.farms << @farm
              render json: @farm, status: :created
            rescue
              render json: {error:"duplicate"}, status: :created
            end
          else
            render json: {error: "farm not found"}, status: :not_found
          end
        else
          render json: {error: "team not found"}, status: :not_found
        end
      end

      # PATCH/PUT /teams/1
      # PATCH/PUT /teams/1.json
      def update
        @team = Team.find(params[:id])

        if @team.update(team_params)
          head :no_content
        else
          render json: @team.errors, status: :unprocessable_entity
        end
      end

      # DELETE /teams/1
      # DELETE /teams/1.json
      def destroy
        @team.destroy

        head :no_content
      end

      private

        def set_team
          @team = Team.find(params[:id])
        end

        def team_params
          params[:team]
        end
    end

  end
end
