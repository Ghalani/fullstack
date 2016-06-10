class FarmerMessageSerializer < ActiveModel::Serializer
  attributes :id, :manager_id, :farmer_id, :body
end
