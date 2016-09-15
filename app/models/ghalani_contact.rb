class GhalaniContact < ActiveRecord::Base
	validates :email, presence: true, uniqueness: true
	validates :name, presence: true, uniqueness: true
end
