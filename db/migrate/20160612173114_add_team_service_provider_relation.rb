class AddTeamServiceProviderRelation < ActiveRecord::Migration
  def change
    rename_table :assemblies_parts, :service_providers_teams
    rename_column :service_providers_teams, :service_providers_id, :service_provider_id
  end
end
