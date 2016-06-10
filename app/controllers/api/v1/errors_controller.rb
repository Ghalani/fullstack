module Api
	module V1
		class ErrorsController < ApplicationController
		  skip_before_filter :ensure_authenticated_user
		  def routing
		    render json: {
		      "errors":"No route matches [#{request.method}] #{request.path}"
		      }, status: 404
		  end
		end
  end
end