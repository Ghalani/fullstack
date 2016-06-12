class AddRegionIdToFarms < ActiveRecord::Migration
  def change
  	add_reference :farms, :region, index: true
  end
end
