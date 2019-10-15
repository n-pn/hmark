# Highmark

A bastard child of markdown and bbcode. Combining the flexibility of bbcode tags
with the convenient of some markdown markups.

## Installation

TODO

## Usage

TODO

## Cheatsheet

### Inline elements

**Markup:**

-   Inline element with no attribute: `[mark]content[/mark]`
-   Inline element with attributes: `[mark attr1="value1" attr2="value2"]content[/mark]`
-   Inline element short hand: `[mark body="content" /]`

**Example**

```bbcode
Lorem [b]ipsum [i]dolor[/i] sit[/b] amet, [url href="http://consectetur.com"]consectetur[/url] adipisicing elit.
```

_Yield:_

```htm
<p>
    Lorem <strong>ipsum <em>dolor</em> sit</strong> amet,
    <a href="http://consectetur.com">consectetur</a> adipisicing elit.
</p>
```

**Current supported inline elements**:

| Markup   | HTML evaquilent | Description     |
| -------- | --------------- | --------------- |
| `[b]`    | `<strong>`      | strong emphasis |
| `[i]`    | `<em>`          | emphasis        |
| `[u]`    | `<u>`           | underline       |
| `[s]`    | `<s>`           | strikethrough   |
| `[sup]`  | `<sup>`         | superscript     |
| `[sub]`  | `<sub>`         | subscript       |
| `[math]` | `<math>`        | math            |
| `[code]` | `<code>`        | code            |

### Markdown-esque markups:

#### Inline

| Type            | Special markup                 | Html output                                                                           |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------- |
| bold            | `*text*`                       | <strong>text</strong>                                                                 |
| italic          | `_text_`                       | <em>text</em>                                                                         |
| code            | `` `text` ``                   | <code>text</code>                                                                     |
| emoji           | `:grinning:`                   | 😀                                                                                    |
| link            | `<http://example.com>`         | <a href="http://example.com">http://example.com</a>                                   |
| link with title | `<google.com>(Google)`         | <a href="//google.com">Google</a>                                                     |
| image           | `!<https://picsum.photos/200>` | <a href="https://picsum.photos/200"><img src="https://picsum.photos/200" alt=""/></a> |

#### Single line

| Type | Markup        | Output           |
| ---- | ------------- | ---------------- |
| h1   | `= Heading`   | <h1>Heading</h1> |
| h2   | `== Heading`  | <h2>Heading</h2> |
| h3   | `=== Heading` | <h3>Heading</h3> |
| hr   | `---`         | `<hr />`         |

#### Multi lines

**Blockquote**

_Markup_

```md
> block
>
> > nested block
```

_Output_

> block
>
> > nested block

**Unordered list**

_Markup_

```md
-   list item 1
-   list item 2
```

_Output_

-   list item 1
-   list item 2

**Ordered list**

_Markup_

```md
-   list item 1
-   list item 2
```

_Output_

1. list item 1
2. list item 2

**Code block**

_Markup_

````md
```js
console.log('Hello, World!')
```
````

_Output_

```js
console.log('Hello, World!')
```

**Table**

_Markup_

```md
| Tables        |      Are      |   Cool |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned | \$1600 |
| col 2 is      |   centered    |   \$12 |
| zebra stripes |   are neat    |    \$1 |
```

_Output_

| Tables        |      Are      |   Cool |
| ------------- | :-----------: | -----: |
| col 3 is      | right-aligned | \$1600 |
| col 2 is      |   centered    |   \$12 |
| zebra stripes |   are neat    |    \$1 |

### BBCode-esque tags

TODO

### Block

**Markup:**

-   No attribute:

    ```
    [[tag]]
    content
    [[/tag]]
    ```

-   With attributes:

    ```
    [[tag attr1="value1" attr2="value2"]]
    content
    [/url]
    ```

-   auto closing
    ```
    [[tag option="value" body="content" /]]
    ```

Examples:

1. Syntax highlight

    ```
    [[code lang="ruby"]]
    print "Hey!"
    [[/code]]
    ```

2. Ascii art, poems

    ```
    [[ascii]]
    /\_/\
    =( °w° )=
    )   (  //
    (__ __)//
    [[/ascii]]
    ```

3. Spoiler/collapsible block

    ```
    [[spoiler title="Spoiler"]]
    Hidden content.
    [[/spoiler]]
    ```

4. Math block

    ```
    [[math syntax="latext"]]
    \Gamma(z) = \int_0^\infty t^[z-1]e^[-t]dt\,.
    [[/math]]
    ```

5. Hidden content

    ```
    [[crypted hash="hmark"]]
    U2FsdGVkX18dmf1WcEODtR/m0vnPezX918/9/qHI56g=
    [[/crypted]]
    ```

## License

MIT
