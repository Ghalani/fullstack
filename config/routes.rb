  Rails.application.routes.draw do
  get 'farmers/index'

  get 'farmers/show'

  get 'farmers/new'

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
      #get 'farms' => 'farms#index'
      resources :farms, only:[:index, :show]
      get 'users' => 'users#index'
      get 'labourers' => 'service_providers#index'
      #get 'inventory' => 'service_providers#index'
      #get 'finances' => 'service_providers#index'
      get 'new_ap' => 'users#new_ap'
      post "create_ap" => 'users#create_ap'
      resources :teams, only:[:new]
    #end
    resources :regions
  end

  resources :farms, only:[:index, :show, :new] do
    resources :teams
    resources :farmers
    get "assign_farmer" => "farmers#assign_farmer"
  end

  root to: "home#index"
  resources :managers do
    resources :farms
  end
  resources :area_planners
  #resources :managers


  post 'teams/:id/asp' => 'teams#add_service_provider'

  resources :regions do
    resources :service_providers
    get 'show_labour' => "regions#show_labour"
  end

  # scope 'admin' do
  #   resources :farms
  # end

  resources :teams do
    resources :team_activities
  end
  resources :onboards, only:[:create]
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
