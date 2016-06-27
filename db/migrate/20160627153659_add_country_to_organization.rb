class AddCountryToOrganization < ActiveRecord::Migration
  def change
    add_reference :organizations, :country
  end
end
