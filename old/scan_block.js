module.exports = function(lines) {
  const trims = lines.map(x => x.trim());

  let output = [];

  for (let i = 0; i < lines.length; i++) {
    let last = output[output.length - 1] || {};
    let trim = trims[i];

    switch (trim.charAt(0)) {
      // for empty lines
      case "":
        output.push({ tag: "nl" });
        break;

      // headings
      case "=":
        let h_lv = 1;
        while (h_lv < 6 && trim.charAt(h_lv) === "=") h_lv += 1;

        output.push({
          tag: "h" + h_lv,
          body: trim.substring(h_lv)
        });
        break;

      // blockquote
      case ">":
        let bq_text = trim.substring(1);

        if (last.tag == "blockquote") {
          last.body.push(bq_text);
        } else {
          output.push({ tag: "blockquote", body: [bq_text] });
        }
        break;

      // ordered list
      case "+":
        let ol_body = [trim.substring(1)];

        // scan for list item's nested content
        let ol_j = i + 1;

        while (ol_j < lines.length) {
          let line = lines[j].replace(/\t/g, "    ");

          if (!utils.is_blank(line.charAt(0))) break;
          if (!utils.is_blank(line.charAt(1))) break;

          ol_body.push(line.substring(2));
          ol_j += 1;
        }

        if (last.tag == "ol") {
          last.body.push(ol_body);
        } else {
          output.push({ tag: "ol", body: [ol_body] });
        }

        i = ol_j - 1;
        break;

      // ruler or unordered list
      case "-":
        // check ruler

        if (/^-{3,}$/.test(trim)) {
          output.push({ tag: "hr" });
          break;
        }

        // for unordered list
        let ul_body = [trim.substring(1)];

        // scan for list item's nested content
        let ul_j = i + 1;

        while (ul_j < lines.length) {
          let line = lines[j].replace(/\t/g, "    ");

          if (!utils.is_blank(line.charAt(0))) break;
          if (!utils.is_blank(line.charAt(1))) break;

          ul_body.push(line.substring(2));
          ul_j += 1;
        }

        if (last.tag == "ul") {
          last.body.push(ul_body);
        } else {
          output.push({ tag: "ul", body: [ul_body] });
        }

        i = ul_j - 1;
        break;

      // check list or div block
      case "[":
        let char = trim.charAt(1);

        // check task list
        if (trim.charAt(2) === "]" && (char === " " || char === "x")) {
          let task = {
            done: char === "x",
            text: trim.substring(3)
          };

          if (last.tag == "tl") {
            last.body.push(task);
          } else {
            output.push({ tag: "tl", body: [task] });
          }
          break;
        }

        // check custom div block
        if (
          char === "[" &&
          trim.charAt(trim.length - 1) === "]" &&
          trim.charAt(trim.length - 2) === "]"
        ) {
          let body = trim.substring(2, trim.length - 2);
          let [name, attrs] = utils.split_once(body);

          // is self closed
          if (attrs.charAt(attrs.length - 1) === "/") {
            attrs = attrs.substring(0, attrs.length - 1);

            output.push({
              tag: "div",
              name,
              body: [],
              attrs: utils.parse_block_attrs(attrs),
              short: true
            });
            break;
          }

          // check for closing tag
          let ctag = `[[/${name}]]`;
          let cpos = i + 1;

          for (; cpos < lines.length && trims[cpos] !== ctag; cpos++);

          // if a closing tag is really found
          if (cpos < lines.length) {
            let body = [];

            for (let j = i + 1; j < cpos; j++) body.push(lines[j]);

            output.push({
              tag: "custom",
              name,
              body,
              attrs: utils.parse_block_attrs(attrs),
              short: false
            });

            i = cpos;
            break;
          }
        }

      // code block
      case "`":
        let cb_count = 1;
        while (trim.charAt(cb_count) === "`") cb_count += 1;

        if (cb_count >= 3) {
          let cb_mark = trim.substring(0, cb_count);
          let cb_lang = trim.substring(cb_count);

          let offset = i + 1;
          while (offset < lines.length && trims[offset] !== cb_mark) {
            offset += 1;
          }

          if (offset < lines.length) {
            let cb_body = [];
            for (let cb_j = i + 1; cb_j < offset; cb_j++) {
              cb_body.push(lines[cb_j]);
            }

            output.push({
              tag: "code",
              body: cb_body.join("\n"),
              attrs: { lang: cb_lang }
            });

            i = offset;
            break;
          }
        }

      // table
      case "|":
        // make sure table line ends with a '|', ignore otherwise
        if (trim.charAt(trim.length - 1) === "|") {
          let cols = trim.substring(1, trim.length - 1).split("|");

          if (last.tag == "table") {
            last.rows.push(cols);
          } else {
            output.push({ tag: "table", rows: [cols] });
          }

          break;
        }

      // regular paragraph
      default:
        if (last.tag === "p") {
          last.body += "\n" + trim;
        } else {
          output.push({ tag: "p", body: trim });
        }
    }
  }

  return output;
};
