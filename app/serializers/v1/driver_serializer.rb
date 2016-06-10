class DriverSerializer < ActiveModel::Serializer
  has_one :manager
  attributes :id, :fname, :lname, :phone, :country
end
