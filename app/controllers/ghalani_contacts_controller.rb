class GhalaniContactsController < ApplicationController
	skip_before_filter :ensure_authenticated_user
	
	def index
		@gc = GhalaniContact.all
		respond_to do |f|
			f.json @gc
		end
	end

	def create
		@gc = GhalaniContact.new(ghalani_contact_param)

		if @gc.save
			if Rails.env.production?
      	BackendSlackbotService.new.send("New subscription by: #{@gc.name} #{@gc.email}")
      end
      render json: @gc
    else
    	render json: @gc.errors
    end
    
	end 

	private
		def ghalani_contact_param
			params.require(:ghalani_contact).permit(:name, :email, :reason)
		end
end
