class Team < ActiveRecord::Base
	belongs_to :area_planner
	belongs_to :farm
	has_and_belongs_to_many :service_providers
end
