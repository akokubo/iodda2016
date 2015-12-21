class Dataset < ActiveRecord::Base
  validates :name, presence: true
  attr_accessor :file
end
