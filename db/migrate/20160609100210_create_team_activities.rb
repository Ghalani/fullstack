class CreateTeamActivities < ActiveRecord::Migration
  def change
    create_table :team_activities do |t|
      t.references :activity
      t.references :team
      t.timestamps null: false
    end
  end
end
