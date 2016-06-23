class AddANdRemoveFromServiceProvider < ActiveRecord::Migration
  def change
      add_column  :service_providers, :name,  :string
      add_column  :service_providers, :phone, :string
      add_column  :service_providers, :gender,:string
      remove_column  :service_providers, :user_id
      remove_column  :service_providers, :is_team_lead      
  end
end
