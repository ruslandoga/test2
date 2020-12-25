<script>
  import { goto } from "@sapper/app";
  let step = 1;

  function proceed() {
    step = step + 1;

    if (step === 3) {
      goto("/app");
    }
  }
</script>

<svelte:head>
  <title>Since | Onboarding: All Done</title>
</svelte:head>

<div class="p-8 prose">
  <h2>Готово!</h2>

  {#if step === 1}
    <p>Теперь твой профиль доступен для обнаружения.</p>

    <p>Каждый день мы будем подбирать Х наиболее подходящих тебе профилей</p>

    <p>
      В отличии от других приложений для знакомств, “количество” лайков здесь не
      имеет значения. Наша политика - лучше найти одного подходящего человека,
      чем сто, но слабо интересных.
    </p>

    <p>
      Будь аккуратен и выбирай только людей, которые тебе по-настоящему
      интересны.
    </p>
  {:else if step === 2}
    <p>
      При взаимной симпатии вы попадете в чат, где сможете познакомиться и
      договориться о первой встрече.
    </p>

    <p>
      Пока вы находитесь в чате с собеседником вы не можете искать себе другую
      пару.
    </p>

    <p>Это сделано для того, чтобы ...</p>
  {/if}
</div>

<button
  type="button"
  on:click={proceed}
  class="fixed flex items-center justify-center w-64 h-20 transition bg-green-300 rounded bottom-10 hover:bg-red-200 hover:shadow-md right-10">
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
    class="w-1/2 h-1/2"><path
      d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
</button>
