class RegionSerializer < ActiveModel::Serializer
  #belongs_to :organization
  attributes :id, :country_id, :name, :state
end
