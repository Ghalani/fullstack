class CreateOrganizations < ActiveRecord::Migration
  def change
    create_table :organizations do |t|
      t.string  :name
      t.text    :bio
      t.timestamps null: false
    end

    add_reference :activities,    :organization, index: true
    add_reference :area_planners, :organization, index: true
    #add_reference :regions,       :organization, index: true
  end
end
