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

    @include min-width(phablet) {
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

    @include corner(md, top);

    @include min-width(phablet) {
      flex: 1;
      resize: none;
      @include corner(md, left);
    }

    // @include font-size(sm);
    @include font-family(mono);
    @include bgcolor(neutral, 7);
    @include color(neutral, 2);
  }

  .output {
    margin-top: 0 !important;
    width: 100%;
    @include bgcolor(white);
    @include corner(md, bottom);
    @include min-width(phablet) {
      flex: 1;
      @include corner(md, right);
    }

    padding: 1rem;
    max-height: 40rem;
    overflow-y: scroll;
    word-break: break-word; /* Chrome, Safari */
    overflow-wrap: anywhere; /* Firefox */
    // word-break: keep-all;
  }

  .m-btn {
    margin: 1rem auto;
  }
  :global(p) {
    img,
    svg {
      display: inline;
      max-width: 100%;
    }
  }
  // article :global(a) {
  //   display: inline-block;
  //   line-height: inherit;
  //   @include color(primary, 6);
  //   margin: 0 -0.125em;
  //   padding: 0 0.125em;
  // }
</style>

<hr />
<h2>{title}</h2>

<div class="hmark">
  <textarea class="input" bind:value={data} on:change={render} />
  <article class="output">
    {@html html}
  </article>
</div>

<button class="m-btn" on:click={save}>Save</button>
