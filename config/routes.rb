Rails.application.routes.draw do
  resources :managers
  resources :farms do
    resources :teams
  end


  post 'teams/:id/asp' => 'teams#add_service_provider'

  resources :region do
    resources :service_providers
  end
  
  scope 'dashboard' do
    resources :farms
  end

  resources :farms
  resources :area_planners
  resources :teams do
    resources :team_activities
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
      resources :teams
      resources :team_assignments
    end
  end
end
