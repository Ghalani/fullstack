class Organization < ActiveRecord::Base
  after_create :create_root_manager

  has_many    :activities, dependent: :destroy
  has_many    :managers, dependent: :destroy
  has_many    :regions, dependent: :destroy
  belongs_to  :user
  belongs_to  :country
  has_many    :activities, dependent: :destroy

  def farms
    farms = []
    self.regions.collect{|m| farms += m.farms}
    return farms
  end

  def service_providers
    sps = self.regions.collect{|rg|
			rg.service_providers
			}.flatten.uniq
  end

  private
  # => create the first manager of the organization, which is the creator of the organization
  def create_root_manager
    Manager.create(user_id: self.user_id, organization_id: self.id)
  end

end
