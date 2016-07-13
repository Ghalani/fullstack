class AddAccessTokenToSpRenamePasswordToPin < ActiveRecord::Migration
  def change
    rename_column :service_providers, :encrypted_password, :encrypted_pin
    add_column    :service_providers, :access_token
  end
end
