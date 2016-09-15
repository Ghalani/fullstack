class CreateOnboards < ActiveRecord::Migration
  def change
    create_table :onboards do |t|
      t.string  :name
      t.string  :email
     
      t.timestamps null: false
    end
  end
end
