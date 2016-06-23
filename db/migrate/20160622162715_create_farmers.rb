class CreateFarmers < ActiveRecord::Migration
  def change
    create_table :farmers do |t|
      t.references :farm
      t.string    :name
      t.string    :phone
      t.string    :gender
      t.datetime  :dob

      t.timestamps null: false
    end
  end
end
