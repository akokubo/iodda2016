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

ActiveRecord::Schema.define(version: 20151221145005) do

  create_table "data", force: :cascade do |t|
    t.integer  "dataset_id"
    t.integer  "municipality_id"
    t.float    "value"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  add_index "data", ["dataset_id", "municipality_id"], name: "index_data_on_dataset_id_and_municipality_id"
  add_index "data", ["dataset_id"], name: "index_data_on_dataset_id"
  add_index "data", ["municipality_id"], name: "index_data_on_municipality_id"

  create_table "datasets", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "municipalities", force: :cascade do |t|
    t.string   "code"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
