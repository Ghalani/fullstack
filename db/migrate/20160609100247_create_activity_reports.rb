class CreateActivityReports < ActiveRecord::Migration
  def change
    create_table :activity_reports do |t|
      t.references :team_activity
      t.references :service_provider
      t.text :report
      t.boolean :is_confirmed
      t.timestamps null: false
    end
  end
end
