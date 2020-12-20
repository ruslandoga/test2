<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let input;
  export let url;

  function onChange() {
    // TODO check size https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
    const file = input.files[0];
    url = URL.createObjectURL(file);
    dispatch("change", { file });
  }
</script>

<label
  class="block w-full h-full overflow-hidden transition rounded-lg cursor-pointer hover:opacity-75 hover:shadow-lg">
  {#if url}
    <img src={url} class="object-cover w-full h-full" alt="todo" />
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
