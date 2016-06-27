Rails.application.routes.draw do
  resources :sessions, only: [:new, :create, :delete]
  get 'signup' => 'users#new'
  get 'login' => 'sessions#new'
  get 'logout' => 'sessions#destroy'
  resources :users
  resources :account_activations, only: [:edit]
  get "accounts/forgot" => "users#forgot_password"
  post "accounts/reset" => "users#reset_password"

  resources :organizations do
    #scope 'farms' do
      get 'farms' => 'farms#index'
      get 'users' => 'users#index'
      get 'new_ap' => 'users#new_ap'
      post "create_ap" => 'users#create_ap'
    #end
    resources :regions
  end

  root to: "home#index"
  resources :managers do
    resources :farms
  end
  resources :area_planners
  #resources :managers
  resources :farms do
    resources :teams
  end


  post 'teams/:id/asp' => 'teams#add_service_provider'

  resources :regions do
    resources :service_providers
  end

  # scope 'admin' do
  #   resources :farms
  # end

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
