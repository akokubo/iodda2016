class CreateMunicipalities < ActiveRecord::Migration
  def change
    create_table :municipalities do |t|
      t.string :code
      t.string :name

      t.timestamps null: false
    end
  end
end
