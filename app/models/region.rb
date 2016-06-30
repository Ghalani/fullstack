class Region < ActiveRecord::Base
  belongs_to  :country
	belongs_to  :organization
  has_many    :farms
  has_many    :service_providers
  #belongs_to  :organization

  validates :name, presence: true, uniqueness: true
  validates :state, presence: true
  validates :country_id, presence: true
end
