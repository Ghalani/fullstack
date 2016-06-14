Rails.application.routes.draw do
  # get 'teams/new'
  #
  # get 'teams/show'
  #
  # get 'farm/new'

  resources :managers
  resources :farms do
    resources :teams
  end

  post 'teams/:id/asp' => 'teams#add_service_provider'

  resources :region do
    resources :service_providers
  end

	# namespace :api, defaults: {format: 'json'} do
 #    scope module: :v1, constraints: ApiConstraints.new(version: 1) do
 #      resources :products
 #    end
 #    scope module: :v2, constraints: ApiConstraints.new(version: 2, default: true) do
 #      resources :products
 #    end
 #  end
 	namespace :api, defaults: {format: 'json'} do
    namespace :v1 do
      resources :farms
    end
  end
 	resources :farms
 	resources :area_planners
end
