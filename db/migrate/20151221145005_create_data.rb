class CreateData < ActiveRecord::Migration
  def change
    create_table :data do |t|
      t.references :dataset, index: true, foreign_key: true
      t.references :municipality, index: true, foreign_key: true
      t.float :value

      t.timestamps null: false
    end
    add_index :data, [:dataset_id, :municipality_id]
  end
end
