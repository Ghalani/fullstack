Rails.application.routes.draw do
  resources :sessions, only: [:new, :create, :delete]
  get 'signup' => 'users#new'
  get 'login' => 'sessions#new'
  get 'logout' => 'sessions#destroy'
  resources :users

  resources :organizations do
    #scope 'farms' do
      get 'farms' => 'organizations#farms'
      get 'users' => 'users#index'
    #end
    resources :regions
  end

  root to: "home#index"

  resources :managers
  resources :farms do
    resources :teams
  end


  post 'teams/:id/asp' => 'teams#add_service_provider'

  resources :regions do
    resources :service_providers
  end

  scope 'admin' do
    resources :farms
  end

  resources :area_planners
  resources :teams do
    resources :team_activities
  end

 	namespace :api, defaults: {format: 'json'} do
    namespace :v1 do
      resources :farms
      resources :teams
      resources :team_assignments
    end
  end
  # namespace :api, defaults: {format: 'json'} do
  #    scope module: :v1, constraints: ApiConstraints.new(version: 1) do
  #      resources :products
  #    end
  #    scope module: :v2, constraints: ApiConstraints.new(version: 2, default: true) do
  #      resources :products
  #    end
  #  end
end
