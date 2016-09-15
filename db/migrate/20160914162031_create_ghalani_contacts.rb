class CreateGhalaniContacts < ActiveRecord::Migration
  def change
    create_table :ghalani_contacts do |t|
    	t.string :name
    	t.string :email
    	t.string :reason
      t.timestamps null: false
    end
  end
end
