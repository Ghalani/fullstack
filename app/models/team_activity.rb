class TeamActivity < ActiveRecord::Base
	belongs_to :activity
	belongs_to :team
	has_many :activity_reports
end
