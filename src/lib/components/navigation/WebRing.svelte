<Accordion type="single">
  {#each networkSites as site}
    <AccordionItem value={site.id}>
      <AccordionTrigger>{site.name}</AccordionTrigger>
      <AccordionContent>
        <Button on:click={() => navigateToSite(site.url)}>
          Visit {site.name}
          <ArrowRight class="ml-2 h-4 w-4" />
        </Button>
      </AccordionContent>
    </AccordionItem>
  {/each}
</Accordion>
