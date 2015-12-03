json.array!(@municipalities) do |municipality|
  json.extract! municipality, :id, :code, :name
  json.url municipality_url(municipality, format: :json)
end
