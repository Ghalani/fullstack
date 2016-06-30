class OnboardsController < ApplicationController
  skip_before_filter :ensure_authenticated_user
  def create
    @onboard = Onboard.new(onboard_param)

      if @onboard.save
        #render json: @subscription, status: :created, location: @subscription
        BackendSlackbotService.new.send("New subscription by: #{@onboard.name} #{@onboard.email}")
        flash[:info] = "Thank you for requesting a demo"
        redirect_to "/"
      else
        flash[:notice] = @onboard.errors.full_messages.to_sentence
        redirect_to "/"
      end
  end

  private
    def onboard_param
      params.require(:onboard).permit(:name, :email)
    end
end
