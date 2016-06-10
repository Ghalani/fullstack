class CountrySerializer < ActiveModel::Serializer
  attributes :id, :iso, :iso3, :name, :nicename, :numcode, :phonecode
end
