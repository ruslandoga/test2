<script>
  import Tags from "svelte-tags-input";
  import { createEventDispatcher } from "svelte";
  export let error;
  export let field;
  export let tags;
  export let title;
  export let placeholder;

  const dispatch = createEventDispatcher();

  function onTags(e) {
    dispatch("tags", {
      tags: e.detail.tags
        .toString()
        .split(",")
        .map((d) => d.trim()),
    });
  }
</script>

<style>
  .custom-tags :global(.svelte-tags-input-layout) {
    min-height: 5rem;
    border-radius: 9999px !important;
    padding-left: 2.5rem !important;
    padding-right: 2.5rem !important;
    margin-top: 0.5rem;
    font-size: 2.25rem !important;
    line-height: 2.5rem;
    border-width: 2px !important;
  }

  .custom-tags :global(.svelte-tags-input-tag) {
    font-size: 2.25rem !important;
  }

  .custom-tags :global(.svelte-tags-input) {
    font-size: 2.25rem !important;
  }
</style>

<div class="custom-tags">
  <label for={field}>
    <span
      class="ml-8 text-xl font-semibold {error ? 'text-red-600' : ''}">{title}</span>
    {#if error}<span class="text-xl text-red-400">{error}</span>{/if}
    <Tags
      on:tags={onTags}
      {tags}
      name="music"
      id="music"
      allowBlur={true}
      maxTags={5}
      onlyUnique={true}
      {placeholder} />
  </label>
</div>
