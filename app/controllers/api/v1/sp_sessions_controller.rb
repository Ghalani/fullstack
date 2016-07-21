module Api
  module V1
    class SpSessionsController < ApplicationController
      skip_before_filter :ensure_authenticated_user

      def new
        @sp = ServiceProvider.where(phone: params[:phone]).first
        if @sp
          pin = rand.to_s[2..7]
          @sp.encrypt_pin pin
          if @sp.save
            # => send sms and generate pin
            puts "#"*100; puts pin
            TwilioSmsService.new.send(@sp.formated_numb, "From Ghalani, Enter #{pin} on the OTP field to sign-in ")
            render json: {message: "SMS sent", pin: pin}, status: 200
          end
        else
          render json: { error: "This number (#{params[:phone]}) is not authorized in our system" }
        end
      end

      def create
        @sp = ServiceProvider.where(phone: sp_session_params[:phone]).first
        if @sp && @sp.authenticate(sp_session_params[:pin])
          # => receive code and generate access_token
          @sp.generate_access_token
          @sp.save
          render json: { profile: {id: @sp.id, phone: @sp.phone, access_token: @sp.access_token}, message: "success"}, status: :created
        else
          render json: { error: "Could not authenticate properly." }
        end
      end

      private
        def sp_session_params
          params.require(:sp_session).permit(:phone, :pin)
        end
    end
  end
end
