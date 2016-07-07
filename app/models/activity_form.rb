class ActivityForm < ActiveRecord::Base
  belongs_to :activity
  has_many :fields, class_name: "ActivityFormField"
  accepts_nested_attributes_for :fields, allow_destroy: true
end
