	class Farm < ActiveRecord::Base
  #has_many :farmers
 	belongs_to :region
  #has_many :teams
  belongs_to :manager
	belongs_to :farmer
	has_and_belongs_to_many :teams
	has_many :team_activities

	  validates :name, presence: true, uniqueness: true
	  validates :lat, presence: true, uniqueness: true
	  validates :lon, presence: true, uniqueness: true
	  validates :region_id, presence: true, uniqueness: true
end
