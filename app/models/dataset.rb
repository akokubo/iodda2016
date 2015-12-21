class Dataset < ActiveRecord::Base
  validates :name, presence: true
end
