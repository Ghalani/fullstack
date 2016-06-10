class CreateServiceProviderAndTeam < ActiveRecord::Migration
  def change
    create_table :teams do |t|
      t.references :area_planner
      t.references :farm
      t.timestamps null: false
    end

    create_table :service_providers do |t|
      t.references :user
      t.boolean :is_team_lead
      t.timestamps null: false
    end

    create_table :assemblies_parts, id: false do |t|
      t.belongs_to :team, index: true
      t.belongs_to :service_providers, index: true
    end
  end
end
