class RemoveCoordFromFarms < ActiveRecord::Migration
  def change
  	remove_column :farms, :coord
  	add_column 		:farms, :lat, :decimal
  	add_column		:farms, :lon, :decimal
  end
end
