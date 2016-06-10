class FarmSerializer < ActiveModel::Serializer
  #has_one :region
  #has_many :farmers
  attributes :id, :name, :coord, :area
end
