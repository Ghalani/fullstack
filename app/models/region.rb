class Region < ActiveRecord::Base
  belongs_to  :country
	belongs_to  :organization
  has_many    :farms, dependent: :destroy
  has_many    :service_providers, dependent: :destroy
  has_many    :teams, dependent: :destroy
  has_many    :farmers, dependent: :destroy
  #belongs_to  :organization

  validates :name, presence: true, uniqueness: true
  validates :lat, presence: true
  validates :lon, presence: true
end
