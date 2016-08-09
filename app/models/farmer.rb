class Farmer < ActiveRecord::Base
  before_save :downcase_fields
  has_many :farms, dependent: :destroy
  belongs_to :region

  validates :fname, presence: true
  validates :lname, presence: true
  validates :phone, presence: true
  # => validates_uniqueness_of :fname, scope: :lname
  # => To avoid race condition: add_index :farmers, [ :fname, :lname ], :unique => true
  has_attached_file :image, styles: { large: "600X600#", medium: "300x300#", thumb: "100x100#" }, default_url: 'user.png'
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  def fl_name
    "#{self.fname} (#{self.lname})"
  end

  private
    def downcase_fields
      self.fname.downcase!
      self.lname.downcase!
    end
end
