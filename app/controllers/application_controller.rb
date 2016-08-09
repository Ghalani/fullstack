class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception
  protect_from_forgery with: :null_session
  before_filter :ensure_authenticated_user


	private

	# Returns 401 if the user isn't authorized
	def ensure_authenticated_user
    #head :unauthorized unless current_user
    # if current_user
    #   if !current_user.activated
    #     redirect_to '/'
    #     flash[:info] = "Check your email and verify your account"
    #   end
    # else
    #   redirect_to '/'
    #   flash[:info] = "Please login again..."
    # end
  end

  # Returns 401 if the user isn't an admin
  def ensure_admin_user
    head :unauthorized unless current_user.admin
  end

  def current_user
    return unless session[:user_id]
    @current_user ||= User.find_by_id(session[:user_id])
  end

  # Returns the user belonging to the access token
  def current_user_api
    api_key = ApiKey.where(access_token: token).first

    if api_key && !api_key.is_expired? && !api_key.is_locked
      @currentUser = api_key.user
    else
      return nil
    end
  end

	# Grabs the access token from the header
	def token
		access_token = request.headers["X-ACCESS-TOKEN"]

		# allows tests to pass
		access_token ||= request.headers["rack.session"].try(:[], 'X-ACCESS-TOKEN')

		if access_token.present?
			access_token
		else
			nil
		end
	end

  def set_organization_manager(id)
    @organization = Organization.find(id)
    begin
      raise "Organization doesn't exist" unless (@organization)
      raise "You are not authorized to view this Organization" unless (@manager = current_user.is_manager(id))
    rescue Exception => e
      puts e.message
      flash[:info] = e.message
      redirect_to "/"
    end
  end

  helper_method :current_user, :is_admin?
end
