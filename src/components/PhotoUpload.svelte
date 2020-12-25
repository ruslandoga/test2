<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { preflightUpload, uploadPhoto } from "photos";

  let input;
  let progress = 0;
  export let photo;
  export let channel;

  // photo = { url, key }

  async function onChange() {
    // TODO check size https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
    const file = input.files[0];
    photo.url = URL.createObjectURL(file);
    photo.isUploading = true;
    dispatch("selected", { photo });

    const { url, key, fields } = await preflightUpload(channel, file);
    await uploadPhoto(file, url, fields, (p) => {
      progress = p;
    });
    photo.key = key;
    photo.isUploading = false;
    dispatch("uploaded", { photo });
  }
</script>

<label
  class="relative block w-full h-full overflow-hidden transition rounded-lg cursor-pointer hover:opacity-75 hover:shadow-lg">
  {#if photo.url}
    <img
      src={photo.url}
      class="object-cover w-full h-full"
      alt="тут показана загруженная тобой картинка" />
    {#if progress < 100}
      <div
        style="width: {progress}%;"
        class="absolute top-0 bottom-0 left-0 transition bg-red-100 opacity-30" />
    {/if}
  {:else}
    <div
      class="flex items-center justify-center w-full h-full border-4 border-black rounded-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-20 h-20"><line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" /></svg>
    </div>
  {/if}
  <input
    bind:this={input}
    type="file"
    class="sr-only"
    accept=".jpeg,.png,.jpg"
    on:change={onChange} />
</label>
