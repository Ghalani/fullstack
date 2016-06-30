class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.references  :user, index: true
      t.string  :name
      t.text    :bio
      t.timestamps null: false
    end

  end
end
