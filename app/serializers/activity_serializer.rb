class ActivitySerializer < ActiveModel::Serializer
  has_many :fields
  attributes :id, :name, :description
end
