class CreateFarmsTeams < ActiveRecord::Migration
  def change
    create_table :farms_teams, id: false do |t|
      t.integer :farm_id
      t.integer :team_id
    end
  end
end
