class CreateActivityFormFields < ActiveRecord::Migration
  def change
    create_table :activity_form_fields do |t|
      t.string :name
      t.string :field_type
      t.boolean :required
      t.belongs_to :activity_form, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
