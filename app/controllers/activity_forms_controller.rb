class ActivityFormsController < ApplicationController
  before_action :set_activity_form, only: [:show, :edit, :update, :destroy]
  before_action :set_activity

  # GET /activity_forms
  # GET /activity_forms.json
  def index
    @activity_forms = ActivityForm.all
  end

  # GET /activity_forms/1
  # GET /activity_forms/1.json
  def show
    @activity_form.fields
  end

  # GET /activity_forms/new
  def new
    @activity_form = ActivityForm.new
  end

  # GET /activity_forms/1/edit
  def edit
  end

  # POST /activity_forms
  # POST /activity_forms.json
  def create
    @activity_form = ActivityForm.new(activity_form_params)
    @activity_form.activity = @activity

    respond_to do |format|
      if @activity_form.save
        format.html { redirect_to [@activity, @activity_form], notice: 'Activity form was successfully created.' }
        format.json { render :show, status: :created, location: @activity_form }
      else
        format.html { render :new }
        format.json { render json: @activity_form.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /activity_forms/1
  # PATCH/PUT /activity_forms/1.json
  def update
    respond_to do |format|
      puts "#"*100; puts activity_form_params.to_s
      if @activity_form.update(activity_form_params)
        format.html { redirect_to [@activity, @activity_form], notice: 'Activity form was successfully updated.' }
        format.json { render :show, status: :ok, location: @activity_form }
      else
        format.html { render :edit }
        format.json { render json: @activity_form.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /activity_forms/1
  # DELETE /activity_forms/1.json
  def destroy
    @activity_form.destroy
    respond_to do |format|
      format.html { redirect_to activity_forms_url, notice: 'Activity form was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_activity_form
      @activity_form = ActivityForm.find(params[:id])
    end

    def set_activity
      @activity = Activity.find(params[:activity_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def activity_form_params
      params.require(:activity_form).permit(:name, fields_attributes:[:id, :field_type, :name, :required, :_destroy])
    end
end
