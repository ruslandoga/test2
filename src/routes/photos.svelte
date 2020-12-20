<script>
  import PhotoUpload from "../components/PhotoUpload.svelte";
  let photos = [
    { url: "http://www.fillmurray.com/140/200" },
    { url: "http://www.fillmurray.com/460/300" },
    { url: "http://www.fillmurray.com/200/200" },
    { url: "http://www.fillmurray.com/140/200" },
    { url: "http://www.fillmurray.com/460/300" },
    // { url: "http://www.fillmurray.com/200/200" },
    // { url: "http://www.fillmurray.com/460/300" },
    // { url: "http://www.fillmurray.com/140/200" },
    // { url: "http://www.fillmurray.com/460/300" },
    // { url: "http://www.fillmurray.com/140/200" },
    // { url: "http://www.fillmurray.com/460/300" },
    { url: null },
    // { url: null },
    // { url: null },
    // { url: null },
    // { url: null },
  ];

  function maybeWithPlaceholder(photos) {
    photos = photos.filter((p) => p.url);
    if (photos.length < 8) {
      return [...photos, { url: null }];
    } else {
      return photos;
    }
  }

  photos = maybeWithPlaceholder(photos);

  function onChange(event) {
    photos = maybeWithPlaceholder(photos);
  }
</script>

<div
  class="flex flex-wrap max-w-lg mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
  {#each photos as photo (photo)}
    <div class="w-1/3 h-40 p-1 sm:h-48 md:w-1/4">
      <PhotoUpload bind:url={photo.url} on:change={onChange} />
    </div>
  {/each}
</div>
