class Team < ActiveRecord::Base
	belongs_to 	:manager
	#belongs_to 	:farm
	belongs_to	:region
	belongs_to 	:service_provider, foreign_key: 'leader_id'
	has_many		:service_providers, through: :team_assignments
	has_many		:team_assignments
	has_many 		:team_activities
	has_and_belongs_to_many :farms

	validates :name, presence: true
	validates_uniqueness_of :name, scope: :region_id

	def add_sp(sp)
		self.service_providers.push(sp)
	end

	def leader
		ServiceProvider.find_by_id(self.leader_id)
	end

	def size
		self.service_providers.size
	end

end
