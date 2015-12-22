class Datum < ActiveRecord::Base
  belongs_to :dataset
  belongs_to :municipality
  validates :dataset_id, presence: true
  validates :municipality_id, presence: true
  validates :value, presence: true
end
