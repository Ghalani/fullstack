class ServiceProviderSerializer < ActiveModel::Serializer
  # has_one :user
  has_many :teams
  attributes :id, :fname, :lname

  def teams
    @teams = Team.where(leader_id: object.id)
  end
end
