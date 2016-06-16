class AddTimeAndDoneToTeamActivities < ActiveRecord::Migration
  def change
    add_column  :team_activities, :start_date,:date
    add_column  :team_activities, :end_date,  :date
    add_column  :team_activities, :is_done,   :boolean
    add_column  :team_activities, :comment,   :text
  end
end
