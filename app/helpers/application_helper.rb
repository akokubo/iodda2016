module ApplicationHelper

  # ページごとの完全なタイトルを返す
  def full_title(page_title = '')
    base_title = "IODDA2016アプリ"
    if page_title.empty?
      base_title
    else
      page_title + " | " + base_title
    end
  end
end
