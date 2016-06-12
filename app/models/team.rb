class Team < ActiveRecord::Base
	belongs_to :area_planner
	belongs_to :farm
	has_and_belongs_to_many :service_providers

	validates :name, presence: true
	validates_uniqueness_of :name, scope: :farm_id
end
