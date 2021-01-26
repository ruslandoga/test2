<script>
  import { onMount } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import { visited } from "utils";

  import SharePhoneForm from "./_SharePhoneForm.svelte";
  import ShareReferralForm from "./_ShareReferralForm.svelte";

  let visit_id = uuidv4();
  let can_copy = false;

  onMount(() => {
    visited(visit_id);
  });

  async function onShared() {
    can_copy = true;
  }
</script>

<svelte:head>
  <title>Since</title>
</svelte:head>

<main class="relative">
  <div class="z-20 p-2 sm:p-4">
    <div class="w-full max-w-sm px-10 mx-auto mt-10 md:max-w-md">
      <h1 class="font-serif text-7xl">Since</h1>
      <h2 class="text-xl md:text-2xl">новое приложение для тех</h2>
    </div>

    <ul
      class="w-full px-10 mx-auto mt-8 space-y-4 text-lg md:max-w-md md:text-xl list-circle"
    >
      <li>кто ищет романтические отношения</li>
      <li>кто ценит свое время</li>
      <li>кому важна не только внешность</li>
      <li>кто хочет навсегда удалиться из приложений для знакомств</li>
    </ul>

    <SharePhoneForm on:shared={onShared} {visit_id} />
  </div>

  <div class="z-20 px-2 pb-12 mt-8 sm:px-4 lg:pb-16">
    <div
      class="w-full max-w-sm px-10 mx-auto space-y-4 text-lg md:max-w-md md:text-xl"
    >
      <p>
        Хочешь сделать крутые фотографии для cвоего будущего профиля в Since?
      </p>

      <p>
        Приведи 5 друзей и мы подарим тебе фотосессию с профессиональным
        фотографом в фотостудии в Москве.
      </p>
    </div>

    <ShareReferralForm {visit_id} {can_copy} />

    <div
      class="w-full max-w-sm px-10 mx-auto mt-8 space-y-4 text-lg md:max-w-md md:text-xl"
    >
      <ol class="space-y-2 text-sm list-decimal">
        <li>создай персональную ссылку</li>
        <li>отправь её друзьям</li>
        <li>
          как только 5 друзей оставят свои мобильные номера, мы напишем тебе по
          поводу фотосессии
        </li>
      </ol>
    </div>
  </div>

  <div
    class="absolute top-0 left-0 z-10 w-full h-full overflow-hidden pointer-events-none"
  >
    <div
      class="w-full h-full transform -translate-x-1/2 -translate-y-1/2 radial-gradient"
    />
  </div>

  <div
    class="absolute bottom-0 right-0 z-10 w-1/2 h-full overflow-hidden pointer-events-none"
  >
    <div class="w-full h-full transform translate-x-1/2 radial-gradient" />
  </div>
</main>

<style>
  .radial-gradient {
    background: radial-gradient(
      41.63% 41.63% at 50% 50%,
      rgba(255, 211, 192, 0.7) 0%,
      rgba(217, 203, 194, 0) 100%
    );
  }

  .list-circle {
    list-style: circle;
  }
</style>
