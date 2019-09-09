defmodule Hmark do
  def to_html(text) do
    text
    |> Hmark.Parser.parse()
    |> Hmark.Renderer.render()
  end
end
