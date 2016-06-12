class CreateRegions < ActiveRecord::Migration
  def change
    create_table :regions do |t|
      t.references  :country
      t.references  :organization
      t.string      :name
      t.string      :state

      t.timestamps null: false
    end
  end
end
