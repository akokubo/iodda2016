require 'csv'

class Datum < ActiveRecord::Base
  belongs_to :dataset
  belongs_to :municipality
  validates :dataset_id, presence: true
  validates :municipality_id, presence: true
  validates :value, presence: true

  def self.import(dataset)
      CSV.foreach(dataset.file.path, { encoding: "cp932:utf-8", row_sep: "\r\n", headers: true, skip_blanks: true }) do |row|
        municipality = Municipality.find_by(name: row["市町村"])
        dataset.data.create!(value: row["値"].to_f, municipality_id: municipality.id) if municipality
      end
  end
end
