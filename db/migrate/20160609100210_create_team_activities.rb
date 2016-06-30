class CreateTeamActivities < ActiveRecord::Migration
  def change
    create_table :team_activities do |t|
      t.references :activity
      t.references :team
      t.integer    :team_leader_id
      t.date        :start_date
      t.date        :end_date
      t.boolean     :is_done
      t.text        :comment
      t.timestamps null: false
    end
  end
end
