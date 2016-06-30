class CreateServiceProviderAndTeam < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.references :manager
      t.references :farm
      t.string      :name
      t.timestamps null: false
    end

    create_table :service_providers do |t|
      t.references  :region, index: true
      t.string  :fname
      t.string  :lname
      t.string  :phone
      t.string  :gender
      t.timestamps null: false
    end
  end
end
