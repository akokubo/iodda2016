json.dataset @dataset.name
json.data do
  json.array! @dataset.data do |datum|
    json.municipality datum.municipality.name
    json.value datum.value
  end
end
