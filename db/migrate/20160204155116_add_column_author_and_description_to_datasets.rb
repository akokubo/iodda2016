class AddColumnAuthorAndDescriptionToDatasets < ActiveRecord::Migration
  def change
    add_column :datasets, :author, :string
    add_column :datasets, :description, :text
  end
end
