# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w(
  ie10-viewport-bug-workaround.css
  ie8-responsive-file-warning.js
  ie-emulation-modes-warning.js
  d3.min.js
  d3pie.min.js
  bootstrap-colorpicker.min.js
  draw-D3-GoogleMaps-bars-chart.js
  draw-D3-GoogleMaps-GeoJSON-chart.js
  draw-d3pie-chart.js
  draw-D3-horizontal-bars-chart.js
  draw-D3-pie-chart.js
  compare.js
)
