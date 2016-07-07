class AddActivityToActivityFormField < ActiveRecord::Migration
  def change
    remove_column :activity_form_fields, :activity_form_id
    add_reference :activity_form_fields, :activity
  end
end
