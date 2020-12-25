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
  // let name = "";
  // let extraNameClasses = "border-black focus:ring-gray-300 focus:bg-gray-100";
  import { onMount } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import { imask } from "svelte-imask";
  import * as yup from "yup";
  import { getOnboardingChannel } from "utils";
  import { goto } from "@sapper/app";
  // TODO
  // import FloatingProceedButton from "../../components/FloatingProceedButton.svelte";

  import { parse, isDate } from "date-fns";

  export let profile;

  let channel;

  onMount(async () => {
    // TODO ensure we are connected
    channel = await getOnboardingChannel();
  });

  const today = new Date();

  function parseDateString(value, originalValue) {
    console.log([value, originalValue]);
    const parsedDate = isDate(originalValue)
      ? originalValue
      : parse(originalValue, "dd/MM/yyyy", new Date());

    return parsedDate;
  }

  const {
    form,
    isValid,
    errors,
    state,
    handleChange,
    handleSubmit,
  } = createForm({
    initialValues: profile,
    validationSchema: yup.object().shape({
      gender: yup
        .string()
        .oneOf(["M", "F"], "обязателен")
        .required("обязателен"),
      name: yup.string().required("обязательно"),
      birthdate: yup
        .date()
        .transform(parseDateString)
        .typeError("должна быть в формате '31/01/1990'")
        .min("01/01/1920", "слишком давно")
        // TODO
        .max(today, "ещё рано")
        .required("обязательно"),
      height: yup
        .number()
        .min(100, "маловат")
        .max(240, "великоват")
        .typeError("должен быть в формате '185'")
        .required("обязателен")
        .positive("вниз не растут")
        .integer("в полных сантиметрах"),
      home_city: yup.string().required("обязателен"),
    }),
    onSubmit: (values) => {
      channel
        .push("submit-general-info", { profile: values })
        .receive("ok", () => {
          // TODO we get profile here, we should store it?
          goto("/onboarding/work-and-education");
        })
        .receive("error", (e) => {
          console.log("error from channel", e);
        });
    },
  });
</script>

<svelte:head>
  <title>Since | Onboarding: General Info</title>
</svelte:head>

<!-- TODO prevent default? -->
<form on:submit={handleSubmit} class="p-8 space-y-4">
  <div>
    <label for="name">
      <span
        class="ml-8 text-xl font-semibold {$errors.name ? 'text-red-600' : ''}">имя</span>
      {#if $errors.name}
        <span class="text-xl text-red-400">{$errors.name}</span>
      {/if}
      <input
        type="text"
        name="name"
        id="name"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.name}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.name ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="Василиса Прекрасная или кто ты там" />
    </label>
  </div>
  <div>
    <span
      class="ml-8 text-xl font-semibold {$errors.gender ? 'text-red-600' : ''}">пол</span>
    {#if $errors.gender}
      <span class="text-xl text-red-400">{$errors.gender}</span>
    {/if}
    <div class="flex h-20">
      <label
        for="gender-female"
        class="flex items-center justify-center w-1/2 h-full text-3xl font-semibold text-pink-700 transition bg-pink-100 rounded-l-full cursor-pointer hover:bg-pink-200 focus:ring {$form.gender === 'F' ? 'border border-black' : ''}">
        Ж
        <input
          type="radio"
          id="gender-female"
          name="gender"
          bind:group={$form.gender}
          on:change={handleChange}
          value={'F'}
          class="sr-only" />
      </label>
      <label
        for="gender-male"
        class="flex items-center justify-center w-1/2 h-full text-3xl font-semibold text-blue-700 transition bg-blue-100 rounded-r-full cursor-pointer hover:bg-blue-200 focus:ring {$form.gender === 'M' ? 'border border-black' : ''}">
        М
        <input
          type="radio"
          id="gender-male"
          name="gender"
          bind:group={$form.gender}
          on:change={handleChange}
          value={'M'}
          class="sr-only" />
      </label>
    </div>
  </div>
  <label class="block" for="birthdate">
    <span
      class="ml-8 text-xl font-semibold {$errors.birthdate ? 'text-red-600' : ''}">дата
      рождения</span>
    {#if $errors.birthdate}
      <span class="text-xl text-red-400">{$errors.birthdate}</span>
    {/if}
    <input
      type="text"
      name="birthdate"
      id="birthdate"
      use:imask={{ mask: '00/00/0000' }}
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.birthdate}
      class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.birthdate ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
      placeholder="31/01/1990" />
  </label>
  <label class="block" for="height">
    <span
      class="ml-8 text-xl font-semibold {$errors.height ? 'text-red-600' : ''}">рост</span>
    {#if $errors.height}
      <span class="text-xl text-red-400">{$errors.height}</span>
    {/if}
    <input
      type="text"
      name="height"
      id="height"
      use:imask={{ mask: '000' }}
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.height}
      class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.height ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
      placeholder="185" />
  </label>
  <label class="block" for="home_city">
    <span
      class="ml-8 text-xl font-semibold {$errors.home_city ? 'text-red-600' : ''}">родной
      город</span>
    {#if $errors.home_city}
      <span class="text-xl text-red-400">{$errors.home_city}</span>
    {/if}
    <input
      type="text"
      name="home_city"
      id="home_city"
      on:change={handleChange}
      on:blur={handleChange}
      bind:value={$form.home_city}
      class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.home_city ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
      placeholder="Москва" />
  </label>

  <button
    type="submit"
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
