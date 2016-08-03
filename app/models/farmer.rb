class Farmer < ActiveRecord::Base
  before_save :downcase_fields
  has_many :farms, dependent: :destroy
  belongs_to :region

  validates :fname, presence: true
  validates :lname, presence: true
  validates :phone, presence: true
  # => validates_uniqueness_of :fname, scope: :lname
  # => To avoid race condition: add_index :farmers, [ :fname, :lname ], :unique => true

  def fl_name
    "#{self.fname} (#{self.lname})"
  end

  private
    def downcase_fields
      self.fname.downcase!
      self.lname.downcase!
    end
end
