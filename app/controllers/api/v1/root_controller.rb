module Api
  module V1
		class RootController < ApplicationController
		  skip_before_filter :ensure_authenticated_user
		  def index
		    render json: {"message": "Welcome to our API home"}
		  end
		end
  end
end

