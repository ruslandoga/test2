<script>
  import { onMount } from "svelte";
  import OnboardingPhotos from "../../components/OnboardingPhotos.svelte";
  import { getOnboardingChannel } from "../../lib/utils";

  let channel;
  let photos = [];

  onMount(async () => {
    // TODO ensure we are connected
    channel = await getOnboardingChannel();
    channel.push("initial-profile", {}).receive("ok", ({ profile }) => {
      photos = profile.photos;
    });
  });

  function uploadFile(event) {
    const file = event.detail.file;
    console.log(file);

    channel
      .push("get-photo-upload-url", { "content-type": file.type })
      .receive("ok", (resp) => {
        let { url, key, fields } = resp;
        let formData = new FormData();

        Object.entries(fields).forEach(([key, val]) =>
          formData.append(key, val)
        );
        formData.append("file", file);
        let xhr = new XMLHttpRequest();
        // onViewError(() => xhr.abort());
        xhr.onload = () => {
          if (xhr.status === 204 || xhr.status === 200) {
            console.log("uploaded");
            channel.push("uploaded", { key });
            photos.set([...photos, { url: null }]);
          } else {
            console.log("error status code");
          }
        };
        xhr.onerror = () => console.error("xhr error");
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            let percent = Math.round((event.loaded / event.total) * 100);
            console.log(id, "pregress", percent);
          }
        });

        xhr.open("POST", url, true);
        xhr.send(formData);
      });
  }
</script>

<svelte:head>
  <title>Since | Onboarding: Photos</title>
</svelte:head>

<div class="flex flex-col h-screen overflow-hidden">
  <article class="flex items-center justify-center p-8 prose">
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
  <OnboardingPhotos {photos} />
  <div class="h-1/5">
    <a
      href="/onboarding/main-info"
      disabled={true}
      class="flex items-center justify-center w-full h-full transition bg-red-100 hover:bg-red-200 "><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-1/2 h-1/2"><path
          d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg></a>
  </div>
</div>
