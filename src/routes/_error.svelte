<script>
  export let status;
  export let error;

  const dev = process.env.NODE_ENV === "development";
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-screen">
  <h1 class="text-3xl">{status}</h1>

  <p class="font-semibold text-gray-700">{error.message}</p>
</div>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
