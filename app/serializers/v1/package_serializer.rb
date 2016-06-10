class PackageSerializer < ActiveModel::Serializer
  attributes :id, :farm_pickup_id, :item_id, :quantity, :mass
end
