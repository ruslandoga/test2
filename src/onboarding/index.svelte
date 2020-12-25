<script>
  import { onMount } from "svelte";
  import { getOnboardingChannel } from "utils";
  import FloatingProceedButton from "../../components/FloatingProceedButton.svelte";

  onMount(async () => {
    await getOnboardingChannel();
  });
</script>

<svelte:head>
  <title>Since | Onboarding</title>
</svelte:head>

<article class="p-20 prose">
  <h2>Поздравляем!</h2>
  <p>
    Ты сделал первый шаг на пути удаления этого и других приложений для
    знакомств.
  </p>
  <p>
    Сейчас нужно потратить немного времени на твой профиль, чтобы люди смогли
    узнать тебя лучше уже на этапе просмотра анкеты.
  </p>
  <p>
    По стастике средний пользователь проводит в приложении для знакомств больше
    часа (!) в день.
  </p>
  <p>
    Заполнение профиля займет ±10 минут, однако значительно повысит твои шансы
    найти нужного тебе человека!
  </p>
</article>

<FloatingProceedButton href="/onboarding/photos" />
