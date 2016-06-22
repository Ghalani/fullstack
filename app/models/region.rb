class Region < ActiveRecord::Base
  belongs_to  :country
	belongs_to  :organization
  has_many    :farms
  #belongs_to  :organization

  validates :name, presence: true, uniqueness: true
  validates :state, presence: true
  validates :country_id, presence: true
end
