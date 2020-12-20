<script>
  import PhotoUpload from "./PhotoUpload.svelte";
  export let photos;
  function uploadFile() {}
</script>

<form on:submit|preventDefault class="flex flex-1 space-x-2">
  <div class="flex h-1/2">
    {#each photos as photo (photo)}
      <PhotoUpload url={photo.url} on:change={uploadFile} />
    {/each}
  </div>
</form>
