class AddCoordToRegion < ActiveRecord::Migration
  def change
    add_column  :regions, :lat,  :decimal
    add_column  :regions, :lon,  :decimal
  end
end
