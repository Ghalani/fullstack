class TeamAssignmentSerializer < ActiveModel::Serializer
  has_one :service_provider
  has_one :team
  attributes :id
end
