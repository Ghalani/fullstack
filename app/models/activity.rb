class Activity < ActiveRecord::Base
  #has_one :activity_form
  belongs_to :organization
  has_many :team_activities
  has_many :fields, class_name: "ActivityFormField", dependent: :destroy
  accepts_nested_attributes_for :fields, allow_destroy: true
end
