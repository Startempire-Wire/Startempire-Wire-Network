<FloatingTrigger on:click={toggleOverlay}>
  {#if visible}
    <OverlayPanel content={tierContent} />
  {/if}
</FloatingTrigger>
