class CreateAreaPlanners < ActiveRecord::Migration
  def change
    create_table :area_planners do |t|
      t.references :user
      t.timestamps null: false
    end
  end
end
