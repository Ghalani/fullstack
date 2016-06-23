class Organization < ActiveRecord::Base
  has_many :activities
  has_many :area_planners
  has_many :regions
  belongs_to :user
end
