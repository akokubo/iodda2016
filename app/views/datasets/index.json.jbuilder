json.array! @datasets  do |dataset|
  json.extract! dataset, :id, :name, :author, :description
  json.url dataset_url(dataset, format: :json)
end
