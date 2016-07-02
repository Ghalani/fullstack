class RemoveNameFromFarmerAddFLname < ActiveRecord::Migration
  def change
    remove_column :farmers, :name
    add_column  :farmers, :fname, :string
    add_column  :farmers, :lname, :string
  end
end
