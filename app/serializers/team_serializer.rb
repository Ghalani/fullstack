class TeamSerializer < ActiveModel::Serializer
  has_one :region, :manager
  has_many :activities
  attributes :id, :name

  def activities
    TeamActivity.where(team_id: object.id).where("end_date >= ?", Time.now)
  end
end
