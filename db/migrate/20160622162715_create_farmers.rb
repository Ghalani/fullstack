class CreateFarmers < ActiveRecord::Migration
  def change
    create_table :farmers do |t|
      t.references :farms
      t.string    :name
      t.string    :phone
      t.string    :gender
      t.datetime  :dob

      t.timestamps null: false
    end
  end
end
