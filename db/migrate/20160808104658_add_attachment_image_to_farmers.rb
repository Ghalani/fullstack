class AddAttachmentImageToFarmers < ActiveRecord::Migration
  def self.up
    change_table :farmers do |t|
      t.attachment :image
    end
  end

  def self.down
    remove_attachment :farmers, :image
  end
end
