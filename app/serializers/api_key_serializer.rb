class ApiKeySerializer < ActiveModel::Serializer
  has_one :user
  attributes :id, :access_token, :expires_at
end
