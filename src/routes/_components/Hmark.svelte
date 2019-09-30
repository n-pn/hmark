<script>
  import { onMount } from "svelte";

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
    display: flex;
    @include corner(md);
    @include bdcolor(neutral, 3);
  }

  .input {
    width: 50%;
    margin-right: auto;
    padding: 1rem;
    min-height: 25rem;
    @include font-size(sm);
    @include font-family(mono);
  }

  .output {
    width: 50%;
    margin-left: auto;
    padding: 1rem;
    max-height: 80vh;
    overflow-y: scroll;
    word-wrap: break-word;
  }
  .m-btn {
    margin-top: 1rem;
  }
</style>

<div class="hmark">
  <textarea class="input" bind:value={data} on:change={render} />
  <article class="output">
    {@html html}
  </article>
</div>

<button class="m-btn" on:click={save}>Save</button>
