<Tabs value={activeTab}>
  <TabsList class="grid grid-cols-4">
    <TabsTrigger value="sites">Sites</TabsTrigger>
    <TabsTrigger value="members">Members</TabsTrigger>
  </TabsList>

  <TabsContent value="sites">
    <WebRingSites />
  </TabsContent>
</Tabs>
