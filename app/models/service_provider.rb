class ServiceProvider < ActiveRecord::Base
	belongs_to 	:user
	has_many 		:activity_report
	has_many		:team_assignments
	belongs_to 	:region

	def fl_name
		"#{self.fname} #{self.lname}"
	end
end
