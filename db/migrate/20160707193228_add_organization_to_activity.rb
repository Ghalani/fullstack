class AddOrganizationToActivity < ActiveRecord::Migration
  def change
    add_reference :activities, :organization
  end
end
