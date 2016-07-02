class Farmer < ActiveRecord::Base
  has_many :farm
  belongs_to :region

    validates :fname, presence: true
    validates :lname, presence: true
    validates :phone, presence: true
end
