json.array!(@municipalities) do |municipality|
  json.extract! municipality, :id, :code, :name, :lat, :lng
  json.url municipality_url(municipality, format: :json)
end
