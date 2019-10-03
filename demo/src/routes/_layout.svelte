<script>
  export let segment;
</script>

<style>
  :global(#sapper) {
    height: 100%;
  }
  main {
    position: relative;
    max-width: 72rem;
    margin: 0 auto;
    padding: 1rem;
  }
</style>

<main>
  <slot />
</main>
