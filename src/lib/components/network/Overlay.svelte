<script>
  export let tier = 'Free';
  
  const tierColors = {
    'Free': 'bg-gray-600 text-gray-200',
    'FreeWire': 'bg-blue-900 text-blue-300',
    'Wire': 'bg-purple-900 text-purple-300',
    'ExtraWire': 'bg-yellow-900 text-yellow-300'
  };
</script>

<div class="fixed bottom-4 right-4 bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-700">
  <span class="text-xs px-2 py-1 rounded-full {tierColors[tier] || tierColors.Free}">
    {tier}
  </span>
</div>
