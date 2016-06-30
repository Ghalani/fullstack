class Team < ActiveRecord::Base
	belongs_to 	:manager
	belongs_to 	:farm
	has_many		:team_assignments

	validates :name, presence: true
	validates_uniqueness_of :name, scope: :farm_id

	def add_sp(sp)
		self.service_providers.push(sp)
	end
end
