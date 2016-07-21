class CountrySerializer < ActiveModel::Serializer
  attributes :id, :name, :iso, :iso3
end
