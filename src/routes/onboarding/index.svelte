<script>
  import { onMount } from "svelte";
  import { getOnboardingChannel } from "../../lib/utils";
  onMount(async () => {
    await getOnboardingChannel();
  });
</script>

<div class="flex flex-col h-screen overflow-hidden">
  <article class="flex items-center justify-center flex-1 p-8 prose">
    <div>
      <h2>Поздравляем!</h2>
      <p>
        Ты сделал первый шаг на пути удаления этого и других приложений для
        знакомств.
      </p>
      <p>
        Сейчас нужно потратить немного времени на твой профиль, чтобы люди
        смогли узнать тебя лучше уже на этапе просмотра анкеты.
      </p>
      <p>
        По стастике средний пользователь проводит в приложении для знакомств
        больше часа (!) в день.
      </p>
      <p>
        Заполнение профиля займет ±10 минут, однако значительно повысит твои
        шансы найти нужного тебе человека!
      </p>
    </div>
  </article>
  <div class="h-1/5">
    <a
      href="/onboarding/photos"
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
