class CreateFarms < ActiveRecord::Migration
  def change
    create_table :farms do |t|
      t.references  :region
      t.references 	:manager
      t.string      :name
      t.decimal     :lat
      t.decimal     :lon
      t.float       :area

      t.timestamps null: false
    end
  end
end
