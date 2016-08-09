class AddAttachmentImageToServiceProviders < ActiveRecord::Migration
  def self.up
    change_table :service_providers do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :service_providers, :image
  end
end
