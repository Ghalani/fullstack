class AddRegionIdToFarmer < ActiveRecord::Migration
  def change
    add_reference :farmers, :region
  end
end
