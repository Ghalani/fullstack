class TeamActivityReport < ActiveRecord::Base
  belongs_to :service_provider
  belongs_to :team_activity

  validates :service_provider_id, presence: true
  validates :team_activity_id, presence: true
  validates :report, presence: true
end
