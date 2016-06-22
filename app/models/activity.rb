class Activity < ActiveRecord::Base
	has_many :team_activity
	belongs_to :organization
end
