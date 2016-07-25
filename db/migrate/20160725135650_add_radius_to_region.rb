class AddRadiusToRegion < ActiveRecord::Migration
  def change
    add_column :regions, :radius, :integer
  end
end
