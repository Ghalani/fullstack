class AddRegionToServiceProviders < ActiveRecord::Migration
  def change
    add_reference :service_providers, :region, index: true
  end
end
