<script>
    import { onMount } from 'svelte';
    let messages = [];
    
    onMount(() => {
      const port = chrome.runtime.connect({name: "sidepanel"});
      port.onMessage.addListener((msg) => {
        if (msg.message) {
          messages = [...messages, msg.message];
        }
      });
    });
  </script>
  
  <div class="p-4">
    <h1 class="text-2xl font-bold">Welcome, Verious!</h1>
    <div class="my-4 border-t" />
    <div id="messageContainer">
      {#each messages as message}
        <p>{message}</p>
      {/each}
    </div>
  </div> 