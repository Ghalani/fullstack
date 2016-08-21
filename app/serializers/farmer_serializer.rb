class FarmerSerializer < ActiveModel::Serializer
  attributes :id, :phone, :fname, :lname, :gender, :dob, :region_id, :image_url
end
