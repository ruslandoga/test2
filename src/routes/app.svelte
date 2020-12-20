<script>
  import { onMount } from "svelte";
  import { getSocket } from "../lib/utils";

  // export let socketToken;
  let socket;

  onMount(async () => {
    socket = await getSocket();
  });
</script>

<p>app</p>
