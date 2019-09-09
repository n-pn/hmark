defmodule Hmark.Renderer do
  def render(nil), do: nil

  # render pure text elements
  def render(text) when is_binary(text) do
    # TODO: escape/unescape `\]`
    # TODO: smartypants
    Hmark.Scrubber.escape_html(text)
  end

  # render list of tags
  def render(list) when is_list(list) do
    list
    |> Enum.map(&render/1)
    |> Enum.join()
  end

  # render newline
  def render(:br), do: "<br>\n"

  # bold text
  def render({:b, inner}) do
    "<strong>#{render(inner)}</strong>"
  end

  # italic text
  def render({:i, inner}) do
    "<em>#{render(inner)}</em>"
  end

  # underline text
  def render({:u, inner}) do
    "<u>#{render(inner)}</u>"
  end

  # strikethrough text
  def render({:s, inner}) do
    "<s>#{render(inner)}</s>"
  end

  # superscript text
  def render({:sup, inner}) do
    "<sup>#{render(inner)}</sup>"
  end

  # subscript text
  def render({:sub, _, inner}) do
    "<sub>#{render(inner)}</sub>"
  end

  # math text
  def render({:math, type, opts, inner}) do
    format = render(opts[:format]) || "latex"
    inner = render(inner)
    # TODO: Render math on server
    case type do
      :inline ->
        "<math class=\"math _#{format}\">#{inner}</math>"

      :block ->
        """
        <div class="div _math">
          <math class="math _#{format}">#{inner}</math>
        </div>
        """
    end
  end

  # code text
  def render({:code, type, opts, inner}) do
    lang = render(opts[:lang]) || "text"
    inner = Pygments.highlight(inner, lang)

    case type do
      :inline ->
        "<code class=\"code _#{lang}\">#{inner}</code>"

      :block ->
        # TODO: handling more highlight options like line number, code marking...
        """
        <pre class=\"pre _code\">
          <code class=\"code _#{lang}\">#{inner}</code>
        </pre>
        """
    end
  end

  # text link
  def render({:url, :inline, opts, inner}) do
    inner = Hmark.Scrubber.escape_uri(inner)
    title = render(opts[:title]) || inner

    # TODO: add link block support
    attrs = render_opts(rel: "nofollow noreferrer", _target: "blank")
    "<a class=\"url _inline\" href=\"#{inner}\" #{attrs}>#{title}</a>"
  end

  # image
  def render({:img, type, opts, inner}) do
    inner = Hmark.Scrubber.escape_uri(inner)
    alt = render(opts[:caption]) || inner

    case type do
      :inline ->
        "<img class=\"img _inline\" url=\"#{inner}\" alt=\"#{alt}\">"

      :block ->
        attrs = render_opts(rel: "nofollow noreferrer", _target: "blank")

        """
        <a class="url _block _image" url="#{inner}" #{attrs}>
          "<img class=\"img _block\" url=\"#{inner}\" alt=\"#{alt}\">"
        </a>
        """
    end
  end

  # paragraph
  def render({:p, inner}) do
    "<p>#{render(inner)}</p>\n"
  end

  def render({:hr, opts}) do
  end

  # headings
  def render({tag, opts, inner}) when tag in ~w(h1 h2 h3 h4 h5 h6)a do
    name = Hmark.Scrubber.slugify(opts[:name] || inner)
    "<#{tag} name=\"#{name}\">#{render(inner)}</#{tag}>"
  end

  # revert unsupported tags
  def render({tag, type, opts, inner}) do
    opts = render_opts(opts)
    inner = render(inner)

    case type do
      :inline ->
        "[#{tag} #{opts}]#{inner}[/#{tag}]"

      :block ->
        """
        [[#{tag} #{opts}]]
        #{inner}
        [[/#{tag}]]
        """
    end
  end

  defp render_opts(opts) do
    opts
    |> Enum.map(fn {key, val} -> "#{render(key)}=\"#{render(val)}\"" end)
    |> Enum.join(" ")
  end
end
