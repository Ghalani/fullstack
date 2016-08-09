# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160808104658) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

  create_table "activity_form_fields", force: :cascade do |t|
    t.string   "name"
    t.string   "field_type"
    t.boolean  "required"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "activity_id"
  end

  create_table "activity_forms", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "activity_id"
  end

  create_table "api_keys", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "access_token"
    t.string   "scope"
    t.datetime "expires_at"
    t.datetime "created_at"
    t.datetime "last_access"
    t.boolean  "is_locked",    default: false
  end

  add_index "api_keys", ["access_token"], name: "index_api_keys_on_access_token", unique: true, using: :btree
  add_index "api_keys", ["user_id"], name: "index_api_keys_on_user_id", using: :btree

  create_table "countries", force: :cascade do |t|
    t.string   "iso"
    t.string   "name"
    t.string   "nicename"
    t.string   "iso3"
    t.string   "numcode"
    t.string   "phonecode"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "farmers", force: :cascade do |t|
    t.string   "phone"
    t.string   "gender"
    t.datetime "dob"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.integer  "region_id"
    t.string   "fname"
    t.string   "lname"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  create_table "farms", force: :cascade do |t|
    t.integer  "region_id"
    t.integer  "manager_id"
    t.string   "name"
    t.decimal  "lat"
    t.decimal  "lon"
    t.float    "area"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "farmer_id"
  end

  create_table "farms_teams", id: false, force: :cascade do |t|
    t.integer "farm_id"
    t.integer "team_id"
  end

  add_index "farms_teams", ["farm_id", "team_id"], name: "index_farms_teams_on_farm_id_and_team_id", unique: true, using: :btree

  create_table "managers", force: :cascade do |t|
    t.integer  "organization_id"
    t.integer  "user_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "managers", ["organization_id"], name: "index_managers_on_organization_id", using: :btree

  create_table "onboards", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "organizations", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.text     "bio"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "country_id"
  end

  add_index "organizations", ["user_id"], name: "index_organizations_on_user_id", using: :btree

  create_table "regions", force: :cascade do |t|
    t.integer  "country_id"
    t.integer  "organization_id"
    t.string   "name"
    t.string   "state"
    t.decimal  "lat"
    t.decimal  "lon"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "radius"
  end

  add_index "regions", ["country_id"], name: "index_regions_on_country_id", using: :btree
  add_index "regions", ["organization_id"], name: "index_regions_on_organization_id", using: :btree

  create_table "service_providers", force: :cascade do |t|
    t.integer  "region_id"
    t.string   "fname"
    t.string   "lname"
    t.string   "phone"
    t.string   "gender"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "salt"
    t.string   "encrypted_pin"
    t.string   "access_token"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  add_index "service_providers", ["region_id"], name: "index_service_providers_on_region_id", using: :btree

  create_table "team_activities", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "team_id"
    t.integer  "team_leader_id"
    t.date     "start_date"
    t.date     "end_date"
    t.boolean  "is_done"
    t.text     "comment"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.integer  "farm_id"
  end

  create_table "team_activity_reports", force: :cascade do |t|
    t.integer  "team_activity_id"
    t.integer  "service_provider_id"
    t.json     "report"
    t.datetime "datetime"
    t.boolean  "is_confirmed"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "team_assignments", force: :cascade do |t|
    t.integer  "team_id"
    t.integer  "service_provider_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "team_assignments", ["service_provider_id"], name: "index_team_assignments_on_service_provider_id", using: :btree
  add_index "team_assignments", ["team_id"], name: "index_team_assignments_on_team_id", using: :btree

  create_table "teams", force: :cascade do |t|
    t.integer  "manager_id"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "region_id"
    t.integer  "leader_id"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "username"
    t.string   "fname"
    t.string   "lname"
    t.string   "password"
    t.string   "phone"
    t.string   "role"
    t.string   "salt"
    t.string   "encrypted_password"
    t.string   "status",             default: "active"
    t.string   "activation_digest"
    t.boolean  "activated"
    t.datetime "activated_at"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

end
