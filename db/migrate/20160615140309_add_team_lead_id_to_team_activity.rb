class AddTeamLeadIdToTeamActivity < ActiveRecord::Migration
  def change
    add_column :team_activities, :team_leader_id, :integer
  end
end
