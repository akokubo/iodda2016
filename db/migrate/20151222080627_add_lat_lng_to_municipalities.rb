class AddLatLngToMunicipalities < ActiveRecord::Migration
  def change
    add_column :municipalities, :lat, :float
    add_column :municipalities, :lng, :float
  end
end
