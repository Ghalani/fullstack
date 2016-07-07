class AddActivityToActivityForm < ActiveRecord::Migration
  def change
    add_reference :activity_forms, :activity
  end
end
