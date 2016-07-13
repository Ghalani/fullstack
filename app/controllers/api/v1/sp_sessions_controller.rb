module Api
  module V1
    class ServiceProvidersController < ApplicationController
      def new
        @sp = ServiceProvider.find(phone: params[:phone])
        pin = rand.to_s[2..7]
        @sp.encrypt_pin pin
        # => send sms and generate pin
        puts "#"*100; puts pin
      end

      def create
        # => receive code and generate access_token
      end

      private
        def sp_session_params
          params.require(:sp_session).permit(:phone, :pin)
        end
    end
  end
end
