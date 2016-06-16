class RenameSpsToSpInTeamAss < ActiveRecord::Migration
  def change
    rename_column :team_assignments, :service_providers_id, :service_provider_id
  end
end
