Rails.application.routes.draw do
  get 'team_activity_reports/show'

  # resources :activities do
  #   resources :activity_forms
  # end

  get 'farmers/index'

  get 'farmers/show'

  get 'farmers/new'

  resources :sessions, only: [:new, :create, :delete]
  get 'signup' => 'users#new'
  get 'login' => 'sessions#new'
  get 'logout' => 'sessions#destroy'
  get "reset" => "account_activations#new"
  resources :account_activations, only: [:edit, :create]
  #post "accounts/reset" => "users#reset_password"
  resources :users

  resources :organizations do
    #scope 'farms' do
      #get 'farms' => 'farms#index'
    resources :farms, only:[:index,:show]
    get 'users' => 'users#index'
    get 'labourers' => 'service_providers#index'
    #get 'inventory' => 'service_providers#index'
    #get 'finances' => 'service_providers#index'
    get 'new_ap' => 'users#new_ap'
    post "create_ap" => 'users#create_ap'
    resources :teams, only:[:new]
    #end
    resources :regions
    resources :activities
    resources :farmers
  end

  resources :farms, only:[:index, :show, :new] do
    #resources :farmers
    resources :teams
    get "assign_farmer" => "farms#assign_farmer"
  end

  root to: "home#index"
  resources :managers do
    resources :farms do
      get 'assign_teams' => 'farms#assign_teams'
    end
    resources :teams do
      get 'assign_farms' => 'teams#assign_farms'
      get 'new_team_lead' => 'teams#new_team_lead'
    end
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

  resources :regions do
    resources :team_activities
  end
  resources :team_activities, only: [:show]
  resources :team_activity_reports, only: [:show]

  resources :onboards, only:[:create]
 	namespace :api, defaults: {format: 'json'} do
    namespace :v1 do
      resources :farms do
        post "add_team" => "farms#add_team"
      end
      resources :teams do
        post "add_farm" => "teams#add_farm"
      end
      resources :team_assignments
      resources :sp_sessions
      resources :service_providers do
        get "team_act" => "service_providers#get_team_activities"
        get "get_farmers" => "service_providers#get_farmers"
      end
      resources :teams
      resources :team_activity_reports
    end
  end
  
  resources :ghalani_contacts, only:[:index, :create]
end
