class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email
      t.string :password
      t.string :phone
      t.string :username
      t.string :role
      t.string :salt
      t.string :encrypted_password

      t.timestamps null: false
    end
  end
end
