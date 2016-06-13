class ServiceProvidersController < ApplicationController
  def show
    @sp = ServiceProvider.find_by_id(params[:id])
    respond_to do |f|
      f.js
    end
  end

  def new
  end
end
