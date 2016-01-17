class MunicipalitiesController < ApplicationController
  # GET /municipalities
  # GET /municipalities.json
  def index
    @municipalities = Municipality.all
  end
end
