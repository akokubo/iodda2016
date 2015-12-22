class Dataset < ActiveRecord::Base
  has_many :data, dependent: :destroy
  validates :name, presence: true
  attr_accessor :file
end
