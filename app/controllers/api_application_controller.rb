class ApiApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

	private
    # def sp_auth (phone, token)
    #   sp = ServiceProvider.where(phone: phone).first
    #   if !(sp.access_token == token)
    #     render json: {error: "Authourized access"}
    #   end
    # end

	# # Returns 401 if the user isn't authorized
	# def ensure_authenticated_user(access_token)
  #   #head :unauthorized unless current_user
  #   if current_user_api
  #     redirect_to '/'
  #     flash[:info] = "Please login again..."
  #   end
  # end
  #
  #
  # # Returns the user belonging to the access token
  # def current_user_api
  #   api_key = ApiKey.where(access_token: token).first
  #
  #   if api_key && !api_key.is_expired? && !api_key.is_locked
  #     @currentUser = api_key.user
  #   else
  #     return nil
  #   end
  # end
  #
	# # Grabs the access token from the header
	# def token
	# 	access_token = request.headers["X-ACCESS-TOKEN"]
  #
	# 	# allows tests to pass
	# 	access_token ||= request.headers["rack.session"].try(:[], 'X-ACCESS-TOKEN')
  #
	# 	if access_token.present?
	# 		access_token
	# 	else
	# 		nil
	# 	end
	# end

end
