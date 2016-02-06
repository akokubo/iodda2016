class DatasetsController < ApplicationController
  def index
    @datasets = Dataset.all
  end

  def compare
  end

  def how_to_create
  end

  def show
    @dataset = Dataset.find(params[:id])
    @data = @dataset.data
  end

  def bars_chart_on_map
    @dataset = Dataset.find(params[:id])
  end

  def choropleth_chart
    @dataset = Dataset.find(params[:id])
  end

  def horizontal_bars_chart
    @dataset = Dataset.find(params[:id])
  end

  def pie_chart
    @dataset = Dataset.find(params[:id])
  end

  def d3pie_chart
    @dataset = Dataset.find(params[:id])
  end

  def bars_chart_on_map
    @dataset = Dataset.find(params[:id])
  end

  def choropleth_chart
    @dataset = Dataset.find(params[:id])
  end

  def horizontal_bars_chart
    @dataset = Dataset.find(params[:id])
  end

  def pie_chart
    @dataset = Dataset.find(params[:id])
  end

  def d3pie_chart
    @dataset = Dataset.find(params[:id])
  end

  def new
    @dataset = Dataset.new
  end

  def create
    @dataset = Dataset.new(dataset_params)
    if @dataset.save
      Datum.import(@dataset)
      flash[:success] = "データセットを登録しました。"
      redirect_to @dataset
    else
      render 'new'
    end
  end

  def destroy
    Dataset.find(params[:id]).destroy
    flash[:success] = "データセットを削除しました。"
    redirect_to datasets_url
  end

  private
    def dataset_params
      params.require(:dataset).permit(:name, :author, :description, :file)
    end
end
