class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.references  :organization, index: true
      t.string :name
      t.text    :description
      t.timestamps null: false
    end
  end
end
