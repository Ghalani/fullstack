class ServiceProvider < ActiveRecord::Base
	belongs_to :user
	has_many :activity_report
	has_and_belongs_to_many :teams
	belongs_to :region
end
