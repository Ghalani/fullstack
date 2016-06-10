class PickupSerializer < ActiveModel::Serializer
  has_one :driver
  attributes :id, :title, :description, :start_date_time, :delivery_date_time
end
