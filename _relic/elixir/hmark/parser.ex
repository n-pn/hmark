defmodule Hmark.Parser do
  def parse(text) do
    text
    |> parse_tag_block
  end

  @doc "Scan for multi-lined bbccode-like markups, e.g. [[tag]]...[[/tag]]"
  def parse_block_tag(text) do
    case Regex.scan(~r/\A(.+)^\s{0,3}\[\[(.+)\]\]\s+$(.+)\z/su, text) do
      [] ->
        parse_block_mark(text)

      matches ->
        for [_, head, body, tail] <- matches do
          [tag, opts] = body |> String.split(" ", parts: 2, trim: true)
        end
    end
  end

  @doc "Scan for markdown-like block markups like list, blockquote or heading"
  def parse_block_mark(text) do
    text
  end
end
