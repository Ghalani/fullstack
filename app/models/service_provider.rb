class ServiceProvider < ActiveRecord::Base
	belongs_to 	:user
	has_many 		:activity_report
	has_many		:team_assignments
	belongs_to 	:region
	has_many :team_activity_reports

	def fl_name
		"#{self.fname} #{self.lname}".capitalize
	end

	def generate_access_token
    begin
      self.access_token = SecureRandom.hex
    end while self.class.exists?(access_token: access_token)
  end

	def encrypt_pin pin
    if pin.present?
      self.salt = BCrypt::Engine.generate_salt
      self.encrypted_pin= BCrypt::Engine.hash_secret(pin, salt)
    end
  end

  def authenticate(pin)
    self.encrypted_pin == BCrypt::Engine.hash_secret(pin, self.salt)
  end

	def formated_numb
		"+#{self.region.country.phonecode}#{self.phone}"
	end
end
