module Api
  module V1
    class TeamAssignmentsController < ApplicationController
      before_action :set_team_assignment, only: [:show, :update, :destroy]
      skip_before_filter :ensure_authenticated_user

      def index
      end

      # GET /team_activties/1
      # GET /team_activties/1.json
      def show
        render json: @team_assignment
      end

      def create
        @team_assignment = TeamAssignment.new(team_assignment_params)

        if @team_assignment.save
          render json: @team_assignment, status: :created
        else
          render json: @team_assignment.errors, status: :unprocessable_entity
        end
      end

      def update
        if @team_assignment.update(team_assignment_params)
          head :no_content
        else
          render json: @team_assignment.errors, status: :unprocessable_entity
        end
      end

      # DELETE /team_activties/1
      # DELETE /team_activties/1.json
      def destroy
        @team_assignment.destroy

        head :no_content
      end

      private

        def set_team_assignment
          @team_assignment = TeamAssignment.find(params[:id])
        end

        def team_assignment_params
          params.require(:team_assignment).permit(:service_provider_id, :team_id)
        end
    end

  end
end
