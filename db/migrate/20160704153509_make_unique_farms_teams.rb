class MakeUniqueFarmsTeams < ActiveRecord::Migration
  def change
    add_index :farms_teams, [:farm_id, :team_id], :unique => true
  end
end
