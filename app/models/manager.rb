class Manager < ActiveRecord::Base
	belongs_to :user
	belongs_to :organization
	has_many :teams
	has_many :farms

	def get_sp
		tm_sps = self.teams.collect{|t|
			t.team_assignments.collect{|ta|
				ta.service_provider
			}
		}.flatten.uniq
	end

	def sp_num
		get_sp.size
	end

end
