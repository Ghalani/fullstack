class RemoveFarmIdFromFarmerAndAddFArmerIdToFarm < ActiveRecord::Migration
  def change
    remove_column :farmers, :farm_id
    add_reference :farms, :farmer 
  end
end
