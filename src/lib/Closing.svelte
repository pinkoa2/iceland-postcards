<script>
  import Icon from './Icon.svelte'
</script>

<footer class="closing">
  <a class="again" href="#top"><Icon name="arrow-up" size={18} /> Back to the start</a>
</footer>

<style>
  .closing {
    display: grid;
    justify-items: center;
    padding: clamp(80px, 11vw, 140px) var(--gutter) max(56px, env(safe-area-inset-bottom));
  }
  .again {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    font-weight: 600;
    color: var(--on-ground-soft);
  }
  .again:hover {
    color: var(--ink);
  }
</style>
