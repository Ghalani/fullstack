module Api
  module V1
    class ServiceProvidersController < ApplicationController
      before_action :set_service_provider, only: [:show, :update, :destroy]

      # GET /service_providers
      # GET /service_providers.json
      def index
        @service_providers = ServiceProvider.all

        render json: @service_providers
      end

      # GET /service_providers/1
      # GET /service_providers/1.json
      def show
        render json: @service_provider
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

      # DELETE /service_providers/1
      # DELETE /service_providers/1.json
      def destroy
        @service_provider.destroy
        head :no_content
      end

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
