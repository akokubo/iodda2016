class Municipality < ActiveRecord::Base
  has_many :data, dependent: :destroy
  validates :code, presence: true, uniqueness: true
  validates :name, presence: true, uniqueness: true
end
