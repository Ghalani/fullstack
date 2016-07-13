class ServiceProvider < ActiveRecord::Base
	belongs_to 	:user
	has_many 		:activity_report
	has_many		:team_assignments
	belongs_to 	:region

	def fl_name
		"#{self.fname} #{self.lname}"
	end

	def generate_access_token
    begin
      self.access_token = SecureRandom.hex
    end while self.class.exists?(access_token: access_token)
  end

	def encrypt_pin
    if pin.present?
      self.salt = BCrypt::Engine.generate_salt
      self.encrypted_pin= BCrypt::Engine.hash_secret(pin, salt)
    end
  end

  def authenticate(pin)
    self.encrypted_pin == BCrypt::Engine.hash_secret(pin, self.salt)
  end
end
