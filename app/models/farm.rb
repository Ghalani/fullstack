	class Farm < ActiveRecord::Base
  #has_many :farmers
 	belongs_to :region
  has_many :teams
  belongs_to :manager
	has_one :farmer

  validates :name, presence: true, uniqueness: true
end
