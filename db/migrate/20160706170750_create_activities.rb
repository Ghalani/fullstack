class CreateActivities < ActiveRecord::Migration
  def change
    drop_table :activities
    create_table :activities do |t|
      t.string :name
      t.text :description

      t.timestamps null: false
    end
  end
end
