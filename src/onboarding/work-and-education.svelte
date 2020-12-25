<script context="module">
  // TODO is there is no cookie -> redirect to auth
  export async function preload(page, session) {
    const res = await this.fetch(APP_ENDPOINT + "/api/profile", {
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

  export let profile;

  let channel;

  onMount(async () => {
    // TODO ensure we are connected
    channel = await getOnboardingChannel();
  });

  const { form, errors, handleChange, handleSubmit } = createForm({
    initialValues: profile,
    validationSchema: yup.object().shape({
      occupation: yup.string().nullable(),
      job: yup.string().nullable(),
      university: yup.string().nullable(),
      major: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      channel
        .push("submit-work-and-education-info", { profile: values })
        .receive("ok", () => {
          // TODO we get profile here, we should store it?
          goto("/onboarding/about-self");
        })
        .receive("error", (e) => {
          console.log("error from channel", e);
        });
    },
  });
</script>

<svelte:head>
  <title>Since | Onboarding: Work & Education</title>
</svelte:head>

<!-- TODO prevent default? -->
<form on:submit={handleSubmit} class="p-8 space-y-4">
  <div>
    <label for="occupation">
      <span
        class="ml-8 text-xl font-semibold {$errors.occupation ? 'text-red-600' : ''}">род
        деятельности</span>
      {#if $errors.occupation}
        <span class="text-xl text-red-400">{$errors.occupation}</span>
      {/if}
      <input
        type="text"
        name="occupation"
        id="occupation"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.occupation}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.occupation ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="аналитик" />
    </label>
  </div>
  <div>
    <label for="job">
      <span
        class="ml-8 text-xl font-semibold {$errors.job ? 'text-red-600' : ''}">место
        работы</span>
      {#if $errors.job}
        <span class="text-xl text-red-400">{$errors.job}</span>
      {/if}
      <input
        type="text"
        name="job"
        id="job"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.job}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.job ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="венчурный фонд" />
    </label>
  </div>

  <div>
    <label for="university">
      <span
        class="ml-8 text-xl font-semibold {$errors.university ? 'text-red-600' : ''}">университет</span>
      {#if $errors.university}
        <span class="text-xl text-red-400">{$errors.university}</span>
      {/if}
      <input
        type="text"
        name="university"
        id="university"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.university}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.university ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="ВШЭ" />
    </label>
  </div>

  <div>
    <label for="major">
      <span
        class="ml-8 text-xl font-semibold {$errors.major ? 'text-red-600' : ''}">специальность</span>
      {#if $errors.major}
        <span class="text-xl text-red-400">{$errors.major}</span>
      {/if}
      <input
        type="text"
        name="major"
        id="major"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.major}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.major ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="математика, экономика" />
    </label>
  </div>

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
