<script>
  import { onMount } from "svelte";

  export let title = "";
  export let name = "spec";

  let data = "";
  let html = "";

  onMount(async () => {
    const res = await fetch(`/api/examples?name=${name}`);
    const json = await res.json();
    data = json.data;

    render();
  });

  async function render() {
    html = "rendering...";

    const res = await fetch("/api/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data })
    });
    const json = await res.json();
    html = json.html;
  }

  function save() {
    fetch(`/api/examples?name=${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, data })
    });
  }
</script>

<style lang="scss">
  .hmark {
    display: block;
    width: 100%;

    @include screen-min(phablet) {
      display: flex;
    }

    @include shadow(md);
    // overflow-wrap: break-word;
    // @include clearfix;
    // @include corner(md);
    // @include bdcolor(neutral, 3);
  }

  .input {
    display: block;
    width: 100%;
    padding: 1rem;
    overflow-y: scroll;
    border: none;

    @include color(neutral, 2);
    @include bgcolor(neutral, 7);
    // @include font-size(sm);
    @include font-family(mono);

    @include corner-top(md);

    @include screen-min(phablet) {
      flex: 1;
      resize: none;
      @include corner(0);
      @include corner-left(md);
    }
  }

  .output {
    display: block;
    width: 100%;

    max-height: 40rem;
    overflow-y: scroll;

    @include bgcolor(white);
    @include corner-bottom(lg);

    @include screen-min(phablet) {
      flex: 1;
      @include corner(0);
      @include corner-right(lg);
    }
  }

  article {
    padding: 1rem;
  }

  .m-btn {
    margin: 1rem auto;
  }
</style>

<hr />
<h2>{title}</h2>

<div class="hmark">
  <textarea class="input" bind:value={data} on:change={render} />
  <div class="output">
    <article>
      {@html html}
    </article>
  </div>

</div>

<button class="m-btn" on:click={save}>Save</button>
