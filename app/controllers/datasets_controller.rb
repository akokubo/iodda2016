class DatasetsController < ApplicationController
  def index
    @datasets = Dataset.all
  end

  def show
    @dataset = Dataset.find(params[:id])
  end

  def new
    @dataset = Dataset.new
  end

  def create
    @dataset = Dataset.new(dataset_params)
    if @dataset.save
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
      params.require(:dataset).permit(:name, :file)
    end
end
