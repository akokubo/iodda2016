class CreateCharts < ActiveRecord::Migration
  def change
    create_table :charts do |t|
      t.string :name
      t.string :author
      t.text :description
      t.string :url
      t.text :options

      t.timestamps null: false
    end
  end
end
