<script>
  export let segment;
</script>

<style>
  :global(#sapper) {
    height: 100%;
  }
  main {
    position: relative;
    max-width: 56em;
    margin: 0 auto;
    padding: 2rem;
  }
</style>

<main>
  <slot />
</main>
