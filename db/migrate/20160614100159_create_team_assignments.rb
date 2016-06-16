class CreateTeamAssignments < ActiveRecord::Migration
  def change
    drop_table      :service_providers_teams
    create_table    :team_assignments do |t|
      t.belongs_to  :team, index: true
      t.belongs_to  :service_providers, index: true
      t.timestamps null: false
    end
  end
end
