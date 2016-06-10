class ActivityReport < ActiveRecord::Base
	belongs_to :team_activity
	belongs_to :service_provider
end
