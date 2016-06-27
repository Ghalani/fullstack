class Manager < ActiveRecord::Base
	belongs_to :user
	belongs_to :organization
	has_many :teams
	has_many :farms

	def sp_num
		tm_sps = self.teams.collect{|t|
			t.team_assignments.collect{|ta|
				ta.service_provider
				}
			}.flatten.uniq.size
	end
end
