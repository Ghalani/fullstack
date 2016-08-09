class ServiceProvider < ActiveRecord::Base
	belongs_to 	:user
	#has_many 		:activity_report
	has_many		:team_assignments, dependent: :destroy
	belongs_to 	:region
	has_many :team_activity_reports
	has_attached_file :image, styles: { large: "600X600>", medium: "300x300#", thumb: "100x100#" }, default_url: 'user.png'
	#default_url: "/images/:style/missing.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

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
