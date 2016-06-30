class HomeController < ApplicationController
  skip_before_filter :ensure_authenticated_user
  def index
  end
end
