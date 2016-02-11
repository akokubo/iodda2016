json.array!(@charts) do |chart|
  json.extract! chart, :id, :name, :author, :description, :url, :options
  json.url chart_url(chart, format: :json)
end
