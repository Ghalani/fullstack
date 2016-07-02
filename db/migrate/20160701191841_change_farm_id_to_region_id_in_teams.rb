class ChangeFarmIdToRegionIdInTeams < ActiveRecord::Migration
  def change
    remove_column :teams, :farm_id
    add_reference :teams, :region
  end
end
