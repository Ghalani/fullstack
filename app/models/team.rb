class Team < ActiveRecord::Base
	belongs_to 	:manager
	#belongs_to 	:farm
	belongs_to	:region
	has_many		:team_assignments
	has_and_belongs_to_many :farms

	validates :name, presence: true
	validates_uniqueness_of :name, scope: :region_id

	def add_sp(sp)
		self.service_providers.push(sp)
	end
end
