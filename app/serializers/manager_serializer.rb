class ManagerSerializer < ActiveModel::Serializer
  has_one :user, :organization
  attributes :id
end
