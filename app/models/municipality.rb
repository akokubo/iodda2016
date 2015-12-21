class Municipality < ActiveRecord::Base
  validates :code, presence: true, uniqueness: true
  validates :name, presence: true, uniqueness: true
end
