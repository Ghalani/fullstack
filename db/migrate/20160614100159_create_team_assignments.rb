class CreateTeamAssignments < ActiveRecord::Migration
  def change
    create_table    :team_assignments do |t|
      t.belongs_to  :team, index: true
      t.belongs_to  :service_provider, index: true
      t.timestamps null: false
    end
  end
end
