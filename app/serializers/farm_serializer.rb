class FarmSerializer < ActiveModel::Serializer
  #has_one :region
  #has_many :farmers
  attributes :id, :name, :lat, :lon, :area
end
