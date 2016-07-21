class TeamActivity < ActiveRecord::Base
	belongs_to :activity
	belongs_to :team
	belongs_to :farm
	has_many :team_activity_reports

	validates :activity_id, presence: true
	validates :team_id, presence: true
	validates :farm_id, presence: true
	validates :start_date, presence: true
	validates :end_date, presence: true
	validate :is_team_busy?

	def is_team_busy?
		begin
			start_d = self.start_date
			end_d = self.end_date
			tas = self.team.team_activities.where(
			"((start_date <= '#{start_d}') AND (end_date >= '#{start_d}') ) OR
			((start_date <= '#{end_d}') AND (end_date >= '#{end_d}') ) OR
			((start_date >= '#{start_d}') AND (end_date >= '#{end_d}') )"
			)
			errors.add(:team, "The selected team has an activity on the date you selected") if (tas.size > 0)
			tas.size > 0
		rescue
			return false
		end
	end
end
#ta = TeamActivity.new(farm_id:1, team_id:10, activity_id:1, start_date: Time.now, end_date: Time.now)
