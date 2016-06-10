class OrganizationSerializer < ActiveModel::Serializer
  has_one :user
  attributes :id, :name
end
