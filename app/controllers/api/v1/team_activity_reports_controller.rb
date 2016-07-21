module Api
  module V1
    class TeamActivityReportsController < ApplicationController
      skip_before_filter :ensure_authenticated_user

      def create
        @tar = TeamActivityReport.new(tar_params)
        puts "#"*100; puts tar_params.to_s
        @sp = ServiceProvider.find(@tar.service_provider_id)
        if @sp
          if @sp.access_token == params[:access_token]
            # host/api/v1/teams/[id]?access_token=2345678
            if @tar.save
              render json: @tar
            else
              render json: {error: "couldn't save report to server: #{@tar.errors.full_messages.to_sentence}"}
            end
          else
            render json: { error: "Unauthorized, your API key is invalid"}
          end
        else
          render json: {error: "service provider doesnt exist"}
        end
      end

      private
        def tar_params
          #params.require(:team_activity_report).permit(:service_provider_id, :team_activity_id, :datetime, :report => Hash)
          params.require(:team_activity_report).permit!

        end
    end

  end
end
