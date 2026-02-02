<script>
  import { TierBadge } from 'shadcn-svelte';
  export let tier = 'Free';
</script>

<div class="fixed bottom-4 right-4 bg-background p-4 rounded-lg shadow-xl">
  <TierBadge {tier} />
  <!-- Web Ring Nav Components -->
</div>
