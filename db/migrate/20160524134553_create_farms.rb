class CreateFarms < ActiveRecord::Migration
  def change
    create_table :farms do |t|
      #t.references  :region
      t.references 	:area_planner
      t.string      :name
      t.decimal     :coord, array: true, default: []
      t.float       :area

      t.timestamps null: false
    end
  end
end
