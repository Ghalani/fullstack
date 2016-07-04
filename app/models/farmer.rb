class Farmer < ActiveRecord::Base
  has_many :farm
  belongs_to :region

    validates :fname, presence: true
    validates :lname, presence: true
    validates :phone, presence: true

    def fl_name
      "#{self.fname} (#{self.lname})"
    end
end
