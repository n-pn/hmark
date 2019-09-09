defmodule Hmark.Scrubber do
  @doc "Make HTML friendly url"
  def escape_uri(uri) when is_binary(uri) do
    # TODO: handle html entities correctly
    URI.encode(uri)
  end

  @doc "Make HTML friendly text"
  def escape_html(text) when is_binary(text) do
    # TODO: handle html entities correctly
    text
    |> String.replace("<", "&lt;")
    |> String.replace(">", "&gt;")
  end

  def slugify(text) when is_binary(text) do
    text
    |> String.downcase()
    |> Enum.split(" ")
    |> Enum.take(5)
    |> Enum.join("-")
  end
end
