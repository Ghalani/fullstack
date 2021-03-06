class OrganizationsController < ApplicationController
  before_action :set_organization, only: [:show, :edit, :update, :destroy]

  layout 'admin', only:[:show]

  # GET /organizations
  # GET /organizations.json
  def index
    @organizations = current_user.organizations
  end

  # GET /organizations/1
  # GET /organizations/1.json
  def show
    if is_confirm_owner?
      @regions = @organization.regions
      @managers_num = @organization.managers.size
      @tact_num = @organization.activities.collect{|act| act.team_activities}.flatten.uniq.size
      @farms = @regions.collect{|rg| rg.farms}.flatten
      @total_acreage = 0
      @farms.each do |f|
        @total_acreage += f.area
      end
      @labours_num = @regions.collect{|rg| rg.service_providers}.flatten.size
    else
      unauth
    end
  end

  # GET /organizations/new
  def new
    @organization = Organization.new
    @countries = Country.all
  end

  # GET /organizations/1/edit
  def edit
  end

  def farms
    render 'farms'
  end

  # POST /organizations
  # POST /organizations.json
  def create
    @organization = Organization.new(organization_params)
    @organization.user_id = current_user.id

    if @organization.save
      flash[:success] = "Organization created successfully"
      redirect_to "/organizations"
    else
      render "organizations/new"
    end
  end

  # PATCH/PUT /organizations/1
  # PATCH/PUT /organizations/1.json
  def update
    respond_to do |format|
      if @organization.update(organization_params)
        format.html { redirect_to @organization, notice: 'Organization was successfully updated.' }
        format.json { render :show, status: :ok, location: @organization }
      else
        format.html { render :edit }
        format.json { render json: @organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /organizations/1
  # DELETE /organizations/1.json
  def destroy
    @organization.destroy
    respond_to do |format|
      format.html { redirect_to organizations_url, notice: 'Organization was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_organization
      begin
        @organization = Organization.find(params[:id])
      rescue
        redirect_to "/"
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def organization_params
      params.require(:organization).permit(:name, :country_id)
    end

    def is_confirm_owner?
      current_user == @organization.user
    end

    def unauth
      flash[:info] = "You are not authorized to see this organization"
      redirect_to "/"
    end
end
