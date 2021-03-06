class User < ActiveRecord::Base
  attr_accessor :activation_token
  before_save   :encrypt_password
  before_save   :downcase_fields
  before_create :create_activation_digest
  before_save   :reset_activation_digest
  # after_save :clear_password

  has_many  :organizations, :dependent => :destroy
  #has_many  :managers
  has_many  :api_keys, :dependent => :destroy
  has_one   :service_provider
  has_one   :manager, :dependent => :destroy

  validates :email, presence: true, uniqueness: true
  validates :password, presence: true
  #validates :username, presence: true, uniqueness: true
  #validates :name, presence: true
  has_attached_file :image, styles: { large: "600X600#", medium: "300x300#", thumb: "100x100#" }, default_url: 'user.png'
	#default_url: "/images/:style/missing.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  def fl_name
    "#{self.fname} #{self.lname}"
  end

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

  def is_admin?(organization)
    return false unless organization
    #Organization.find_by_id(organization.id).user_id == self.id
    organization.user_id == self.id
  end

  def is_manager(organization_id)
    return false unless organization_id
    Manager.where(organization_id: organization_id, user_id: self.id).first
  end

  # -------------

  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?
    BCrypt::Password.new(digest).is_password?(token)
  end

  # Returns the hash digest of the given string.
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # Returns a random token.
  def User.new_token
    SecureRandom.urlsafe_base64
  end

  #----------------


  private
  def downcase_fields
    #self.fname.downcase!
    #self.lname.downcase!
    self.email.downcase!
  end

  def create_activation_digest
    self.activation_token  = User.new_token
    self.activation_digest = User.digest(activation_token)
  end

  def reset_activation_digest
    if self.changed.include? "encrypted_password"
      create_activation_digest
    end
  end
end
