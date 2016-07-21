class RegionSerializer < ActiveModel::Serializer
  has_one :country
  attributes :id, :name, :lat, :lon
end
