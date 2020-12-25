<script context="module">
  // TODO is there is no cookie -> redirect to auth
  export async function preload(page, session) {
    const res = await this.fetch(APP_ENDPOINT + `/api/profile`, {
      credentials: "include",
    });

    // TODO if res is unauthed -> redirect to auth
    const { profile } = await res.json();
    return { profile };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";
  import { getOnboardingChannel } from "utils";
  import { goto } from "@sapper/app";
  import KeywordInput from "./_KeywordInput.svelte";

  export let profile;

  let channel;

  onMount(async () => {
    // TODO ensure we are connected
    channel = await getOnboardingChannel();
  });

  function keywordsValidator() {
    return yup
      .array()
      .of(yup.string())
      .max(5, "максимум пять позиций")
      .nullable();
  }

  const { form, errors, state, handleChange, handleSubmit } = createForm({
    initialValues: {
      music: profile.music,
      sports: profile.sports,
      cuisines: profile.cuisines,
      social_networks: profile.social_networks,
      movies: profile.movies,
      musical_instruments: profile.musical_instruments,
      languages: profile.languages,
      tv_shows: profile.tv_shows,
      currently_studying: profile.currently_studying,
      books: profile.books,
      smoking: profile.smoking || "",
      alcohol: profile.alcohol || "",
      pets: profile.pets,
    },
    validationSchema: yup.object().shape({
      music: keywordsValidator(),
      sports: keywordsValidator(),
      cuisines: keywordsValidator(),
      social_networks: keywordsValidator(),
      movies: keywordsValidator(),
      musical_instruments: keywordsValidator(),
      languages: keywordsValidator(),
      tv_shows: keywordsValidator(),
      currently_studying: keywordsValidator(),
      books: keywordsValidator(),
      smoking: yup.string().nullable(),
      alcohol: yup.string().nullable(),
      pets: keywordsValidator(),
    }),
    onSubmit: (values) => {
      channel
        .push("submit-tastes", { profile: values })
        .receive("ok", () => {
          // TODO we get profile here, we should store it?
          goto("/onboarding/all-done");
        })
        .receive("error", (e) => {
          console.log("error from channel", e);
        });
    },
  });

  $: console.log($state);

  $: filledFields = Object.keys($state.form).reduce((acc, field) => {
    let isFilled;
    if (["smoking", "alcohol"].includes(field)) {
      isFilled = $state.form[field].trim() !== "";
    } else {
      isFilled = $state.form[field].length > 0;
    }
    return isFilled ? [...acc, field] : acc;
  }, []);

  $: canProceed = filledFields.length >= 7;
</script>

<svelte:head>
  <title>Since | Onboarding: Tastes</title>
</svelte:head>

<div class="p-8 text-2xl prose">
  <h2>Вкусы / навыки / предпочтения</h2>

  {#if !canProceed}
    <h3>
      Заполни
      {#if filledFields.length === 0}ещё{/if}
      как минимум
      {7 - filledFields.length}
      из предложенных тем, ведь вкусы говорят о многом
    </h3>
  {/if}
</div>
<!-- TODO prevent default? -->
<form
  on:submit|preventDefault={handleSubmit}
  disabled={!canProceed}
  class="p-8 space-y-4">
  <KeywordInput
    on:tags={(e) => {
      handleChange(e);
      $form.music = e.detail.tags;
    }}
    error={$errors.music}
    field={'music'}
    tags={profile.music}
    title="музыка"
    placeholder="скриптонит" />

  <KeywordInput
    on:tags={(e) => {
      $form.sports = e.detail.tags;
    }}
    error={$errors.sports}
    field={'sports'}
    tags={profile.sports}
    title="спорт"
    placeholder="теннис" />

  <div>
    <label for="alcohol">
      <span
        class="ml-8 text-xl font-semibold {$errors.alcohol ? 'text-red-600' : ''}">алкоголь</span>
      {#if $errors.alcohol}
        <span class="text-xl text-red-400">{$errors.alcohol}</span>
      {/if}
      <input
        type="text"
        name="alcohol"
        id="alcohol"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.alcohol}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.alcohol ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="по праздникам" />
    </label>
  </div>

  <div>
    <label for="smoking">
      <span
        class="ml-8 text-xl font-semibold {$errors.smoking ? 'text-red-600' : ''}">курение</span>
      {#if $errors.smoking}
        <span class="text-xl text-red-400">{$errors.smoking}</span>
      {/if}
      <input
        type="text"
        name="smoking"
        id="smoking"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.smoking}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.smoking ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="не курю" />
    </label>
  </div>

  <KeywordInput
    on:tags={(e) => {
      form.update((f) => {
        f.books = e.detail.tags;
        return f;
      });
    }}
    error={$errors.books}
    field={'books'}
    tags={profile.books}
    title="книги"
    placeholder="Акунин" />

  <KeywordInput
    on:tags={(e) => {
      $form.currently_studying = e.detail.tags;
    }}
    error={$errors.currently_studying}
    field={'currently_studying'}
    tags={profile.currently_studying}
    title="предметы изучения"
    placeholder="искусственный интеллект" />

  <KeywordInput
    on:tags={(e) => {
      $form.tv_shows = e.detail.tags;
    }}
    error={$errors.tv_shows}
    field={'tv_shows'}
    tags={profile.tv_shows}
    title="сериалы"
    placeholder="Настоящий Детектив, Лучше Звоните Солу. Ликвидация" />

  <KeywordInput
    on:tags={(e) => {
      $form.languages = e.detail.tags;
    }}
    error={$errors.languages}
    field={'languages'}
    tags={profile.languages}
    title="языки"
    placeholder="молдавский" />

  <KeywordInput
    on:tags={(e) => {
      $form.musical_instruments = e.detail.tags;
    }}
    error={$errors.musical_instruments}
    field={'musical_instruments'}
    tags={profile.musical_instruments}
    title="музыкальные инструменты"
    placeholder="рэп" />

  <KeywordInput
    on:tags={(e) => {
      $form.movies = e.detail.tags;
    }}
    error={$errors.movies}
    field={'movies'}
    tags={profile.movies}
    title="фильмы"
    placeholder="самый лучший фильм" />

  <KeywordInput
    on:tags={(e) => {
      $form.social_networks = e.detail.tags;
    }}
    error={$errors.social_networks}
    field={'social_networks'}
    tags={profile.social_networks}
    title="социальные сети"
    placeholder="onlyfans" />

  <KeywordInput
    on:tags={(e) => {
      $form.cuisines = e.detail.tags;
    }}
    error={$errors.cuisines}
    field={'cuisines'}
    tags={profile.cuisines}
    title="кухни"
    placeholder="китайская" />

  <KeywordInput
    on:tags={(e) => {
      $form.pets = e.detail.tags;
    }}
    error={$errors.pets}
    field={'pets'}
    tags={profile.pets}
    title="питомцы"
    placeholder="ящерица" />

  <button
    type="submit"
    disabled={!canProceed}
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
</form>
