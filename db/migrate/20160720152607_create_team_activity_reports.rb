class CreateTeamActivityReports < ActiveRecord::Migration
  def change
    create_table :team_activity_reports do |t|
      t.references  :team_activity
      t.references  :service_provider
      t.column      :report, :json
      t.datetime    :datetime
      t.boolean     :is_confirmed
      t.timestamps null: false
    end

    drop_table :activity_reports
  end
end
