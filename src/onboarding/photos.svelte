<script context="module">
  import { maybeWithPlaceholder } from "../../lib/photos";

  // TODO is there is no cookie -> redirect to auth
  export async function preload(page, session) {
    const res = await this.fetch(APP_ENDPOINT + `/api/profile`, {
      credentials: "include",
    });

    // TODO if res is unauthed -> redirect to auth
    const { profile } = await res.json();
    return { photos: maybeWithPlaceholder(profile.photos) };
  }
</script>

<script>
  import PhotoUpload from "../../components/PhotoUpload.svelte";
  import FloatingProceedButton from "../../components/FloatingProceedButton";
  import { onMount } from "svelte";
  import { getOnboardingChannel } from "utils";

  export let photos;
  let uploadedPhotos = photos;
  $: canProceed = uploadedPhotos.length >= 3;

  let channel;

  onMount(async () => {
    channel = await getOnboardingChannel();
    // loadingChannel = false;
  });

  function onPhotoSelected() {
    photos = maybeWithPlaceholder(photos);
  }

  function onPhotoUploaded() {
    uploadedPhotos = photos.filter((p) => p.key);
    saveUploadedPhotos(uploadedPhotos);
  }

  function saveUploadedPhotos(uploadedPhotos) {
    const uploadedKeys = uploadedPhotos.map((p) => p.key);
    channel
      .push("add-photos", { profile: { photos: uploadedKeys } })
      .receive("ok", () => {
        // goto("/photos");
      })
      .receive("error", () => {
        // TODO show error
      });
  }
</script>

<svelte:head>
  <title>Since | Onboarding: Photos</title>
</svelte:head>

<article class="p-8 prose">
  <div>
    <h2>Фото!</h2>
    <p>Фото - это первое, на что обращают внимание в твоем профиле.</p>
    <p>Мы рекомендуем фото:</p>
    <ul>
      <li>где хорошо видно лицо и тело</li>
      <li>где ты занимаешься любимыми вещами</li>
    </ul>
  </div>
</article>

<div class="p-8">
  <div
    class="flex flex-wrap max-w-lg mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
    {#each photos as photo (photo)}
      <div class="w-1/3 h-40 p-1 sm:h-48 md:w-1/4">
        <PhotoUpload
          bind:photo
          {channel}
          on:selected={onPhotoSelected}
          on:uploaded={onPhotoUploaded} />
      </div>
    {/each}
  </div>
</div>

<FloatingProceedButton href="/onboarding/general" disabled={!canProceed} />
