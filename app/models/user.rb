class User < ActiveRecord::Base
  before_save :encrypt_password
  # after_save :clear_password

  #has_many  :organizations
  #has_many  :managers
  has_many  :api_keys
  has_one :service_provider
  has_one :area_planner

  validates :email, presence: true, uniqueness: true
  validates :password, presence: true
  #validates :username, presence: true, uniqueness: true
  #validates :name, presence: true

  # default to the web scope if none is provided
  def find_api_key (targetScope = 'web')
    self.api_keys.where(scope: targetScope).first_or_create
  end

  def encrypt_password
    if password.present?
      self.salt = BCrypt::Engine.generate_salt
      self.encrypted_password= BCrypt::Engine.hash_secret(password, salt)
      self.password = nil
    end
  end

  def authenticate(password)
    self.encrypted_password == BCrypt::Engine.hash_secret(password, self.salt)
    #return true
  end
  # def clear_password
  #   puts "#"*100
  #   self.password = nil
  # end
end
