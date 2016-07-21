class TeamActivitySerializer < ActiveModel::Serializer
  has_one :farm, :activity
  attributes :id, :start_date, :end_date, :is_done, :comment
end
