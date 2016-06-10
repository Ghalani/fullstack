class ManagerSerializer < ActiveModel::Serializer
  has_one :region
  has_one :organization
  has_one :user
  attributes :id
end
