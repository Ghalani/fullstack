class AreaPlanner < ActiveRecord::Base
	belongs_to :user
	belongs_to :organization
	has_many :teams
	has_many :farms
end
