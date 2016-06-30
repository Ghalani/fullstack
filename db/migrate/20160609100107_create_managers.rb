class CreateManagers < ActiveRecord::Migration
  def change
    create_table :managers do |t|
      t.references  :organization, index: true
      t.references :user
      t.timestamps null: false
    end
  end
end
