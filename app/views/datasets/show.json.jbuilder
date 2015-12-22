json.dataset @dataset.name
json.data do
  json.array! @dataset.data do |datum|
    json.municipality datum.municipality.name
    json.lat datum.municipality.lat
    json.lng datum.municipality.lng
    json.value datum.value
  end
end
