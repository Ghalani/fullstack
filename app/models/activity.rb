class Activity < ActiveRecord::Base
  #has_one :activity_form
  belongs_to :organization
  has_many :team_activities
  has_many :fields, class_name: "ActivityFormField", dependent: :destroy
  has_attached_file :image, styles: { large: "600X600#", medium: "300x300#", thumb: "100x100#" }, default_url: 'activity.png'
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
  accepts_nested_attributes_for :fields, allow_destroy: true
end
