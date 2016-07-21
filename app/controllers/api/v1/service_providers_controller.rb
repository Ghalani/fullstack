module Api
  module V1
    class ServiceProvidersController < ApplicationController
      before_action :set_service_provider, only: [:show, :update, :destroy]
      skip_before_filter :ensure_authenticated_user, only:[:get_team_activities, :show]

      # GET /service_providers
      # GET /service_providers.json
      def index
        @service_providers = ServiceProvider.all

        render json: @service_providers
      end

      # GET /service_providers/1
      # GET /service_providers/1.json
      def show
        if params[:access_token]
          if @service_provider.access_token == params[:access_token]
            render json: @service_provider
          else
            # => sp need to login again
            render json: {error: "Invalid Key: Please login again"}
          end
        else
          render json: {error: "Unauthorized: API key needed"}
        end
      end

      # POST /service_providers
      # POST /service_providers.json
      def create
        @service_provider = ServiceProvider.new(service_provider_params)

        if @service_provider.save
          render json: @service_provider, status: :created, location: @service_provider
        else
          render json: @service_provider.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /service_providers/1
      # PATCH/PUT /service_providers/1.json
      def update
        @service_provider = ServiceProvider.find(params[:id])

        if @service_provider.update(service_provider_params)
          head :no_content
        else
          render json: @service_provider.errors, status: :unprocessable_entity
        end
      end


      def destroy
        @service_provider.destroy
        head :no_content
      end

      def get_team_activities
        @sp = ServiceProvider.find(params[:service_provider_id])
        if @sp.access_token == params[:access_token]
          # host/service_provider/[service_provider_id]/team_act?access_token=2345678&team=1
          @team = Team.find(params[:team])
          @team_acts = TeamActivity.where(team_id: @team.id).where("end_date >= ?", Time.now)
          render json: @team_acts
        else
          render json: { error: "Unauthorized, your API key is invalid"}
        end
      end
      # def get_teams
      #   # => get the teams where sp is a team-leader
      #   @sp = ServiceProvider.find(params[:service_provider_id])
      #   @teams = Team.where(leader_id: @sp.id)
      #   if @sp.access_token == params[:access_token]
      #     render json: @teams
      #   else
      #     # => sp need to login again
      #     render json: {error: "Please login again"}
      #   end
      # end

      private

        def set_service_provider
          @service_provider = ServiceProvider.find(params[:id])
        end

        def service_provider_params
          params[:service_provider]
        end
    end

  end
end
