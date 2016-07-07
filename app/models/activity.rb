class Activity < ActiveRecord::Base
  #has_one :activity_form
  belongs_to :organization
  has_many :fields, class_name: "ActivityFormField"
  accepts_nested_attributes_for :fields, allow_destroy: true
end
