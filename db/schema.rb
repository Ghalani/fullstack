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

ActiveRecord::Schema.define(version: 20160624161821) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

  add_index "activities", ["organization_id"], name: "index_activities_on_organization_id", using: :btree

  create_table "activity_reports", force: :cascade do |t|
    t.integer  "team_activity_id"
    t.integer  "service_provider_id"
    t.text     "report"
    t.boolean  "is_confirmed"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
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

  create_table "area_planners", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.integer  "organization_id"
  end

  add_index "area_planners", ["organization_id"], name: "index_area_planners_on_organization_id", using: :btree

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

  create_table "drivers", force: :cascade do |t|
    t.integer  "manager_id"
    t.string   "fname"
    t.string   "lname"
    t.string   "phone"
    t.string   "country"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "farm_pickups", force: :cascade do |t|
    t.integer  "farmer_id"
    t.integer  "pickup_id"
    t.string   "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "farmer_messages", force: :cascade do |t|
    t.integer  "manager_id"
    t.integer  "farmer_id"
    t.text     "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "farmers", force: :cascade do |t|
    t.integer  "farm_id"
    t.string   "name"
    t.string   "phone"
    t.string   "gender"
    t.datetime "dob"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "farms", force: :cascade do |t|
    t.integer  "area_planner_id"
    t.string   "name"
    t.float    "area"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.decimal  "lat"
    t.decimal  "lon"
    t.integer  "region_id"
  end

  add_index "farms", ["region_id"], name: "index_farms_on_region_id", using: :btree

  create_table "item_sales", force: :cascade do |t|
    t.integer  "item_id"
    t.integer  "sale_id"
    t.integer  "quantity"
    t.decimal  "weight"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "items", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "managers", force: :cascade do |t|
    t.integer  "organization_id"
    t.integer  "user_id"
    t.integer  "region_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "organizations", force: :cascade do |t|
    t.string   "name"
    t.text     "bio"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "user_id"
  end

  add_index "organizations", ["user_id"], name: "index_organizations_on_user_id", using: :btree

  create_table "packages", force: :cascade do |t|
    t.integer  "farm_pickup_id"
    t.integer  "item_id"
    t.integer  "quantity"
    t.decimal  "mass"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "pickups", force: :cascade do |t|
    t.integer  "driver_id"
    t.integer  "manager_id"
    t.string   "title"
    t.text     "description"
    t.decimal  "start_coord",        default: [],              array: true
    t.decimal  "end_coord",          default: [],              array: true
    t.integer  "start_date_time"
    t.integer  "delivery_date_time"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
  end

  create_table "regions", force: :cascade do |t|
    t.integer  "country_id"
    t.integer  "organization_id"
    t.string   "name"
    t.string   "state"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.decimal  "lat"
    t.decimal  "lon"
  end

  create_table "sales", force: :cascade do |t|
    t.integer  "orgranization_id"
    t.decimal  "revenue"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "service_providers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "region_id"
    t.string   "name"
    t.string   "phone"
    t.string   "gender"
  end

  add_index "service_providers", ["region_id"], name: "index_service_providers_on_region_id", using: :btree

  create_table "subscriptions", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "team_activities", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "team_id"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
    t.date     "start_date"
    t.date     "end_date"
    t.boolean  "is_done"
    t.text     "comment"
    t.integer  "team_leader_id"
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
    t.integer  "area_planner_id"
    t.integer  "farm_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "name"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "password"
    t.string   "phone"
    t.string   "username"
    t.string   "role"
    t.string   "salt"
    t.string   "encrypted_password"
    t.datetime "created_at",                            null: false
    t.datetime "updated_at",                            null: false
    t.string   "fname"
    t.string   "lname"
    t.string   "status",             default: "active"
  end

end
