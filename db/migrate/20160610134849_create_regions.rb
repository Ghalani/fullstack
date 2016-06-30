class CreateRegions < ActiveRecord::Migration
  def change
    create_table :regions do |t|
      t.references  :country, index: true
      t.references  :organization, index: true
      t.string      :name
      t.string      :state
      t.decimal     :lat
      t.decimal     :lon

      t.timestamps null: false
    end
  end
end
