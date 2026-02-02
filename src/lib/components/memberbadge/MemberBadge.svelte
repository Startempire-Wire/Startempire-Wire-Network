<script>
  import { Badge } from '$lib/components/ui/badge';
  export let memberTier;

  const tierConfig = {
    ExtraWire: { variant: 'premium', label: 'ExtraWire' },
    Wire: { variant: 'pro', label: 'Wire' },
    FreeWire: { variant: 'basic', label: 'FreeWire' },
    Free: { variant: 'default', label: 'Free' },
  };
</script>

{#if memberTier in tierConfig}
  <Badge
    variant={tierConfig[memberTier].variant}
    role="status"
    aria-label={`Member tier: ${tierConfig[memberTier].label}`}
  >
    {tierConfig[memberTier].label} Member
  </Badge>
{/if}
