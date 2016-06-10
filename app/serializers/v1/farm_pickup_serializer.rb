class FarmPickupSerializer < ActiveModel::Serializer
  attributes :id, :farm_id, :pickup_id, :description
end
