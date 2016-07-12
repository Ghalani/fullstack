class AddFarmToTeamActivity < ActiveRecord::Migration
  def change
    add_reference :team_activities, :farm
  end
end
