class ServiceProviderSerializer < ActiveModel::Serializer
  has_one :user
  attributes :id, :fname, :lname
end
