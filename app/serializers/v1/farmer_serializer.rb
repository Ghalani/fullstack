class FarmerSerializer < ActiveModel::Serializer
  attributes :id, :manager_id, :farm_id, :fname, :lname, :phone
end
