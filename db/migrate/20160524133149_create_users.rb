class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email
      t.string :username
      t.string  :fname
      t.string  :lname
      t.string :password
      t.string :phone
      t.string :role
      t.string :salt
      t.string :encrypted_password
      t.string :status, default: "active"
      t.string    :activation_digest
      t.boolean   :activated
      t.datetime  :activated_at

      t.timestamps null: false
    end
  end
end
