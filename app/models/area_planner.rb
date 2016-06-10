class AreaPlanner < ActiveRecord::Base
	belongs_to :user
	has_many :teams
	has_many :farms
end
