class AddLeaderToTeam < ActiveRecord::Migration
  def change
    add_column :teams, :leader_id, :integer
    add_column :service_providers, :salt, :string
    add_column :service_providers, :encrypted_password, :string
  end
end
