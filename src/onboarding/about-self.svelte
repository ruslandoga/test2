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
  import Tags from "svelte-tags-input";

  export let profile;

  let channel;

  onMount(async () => {
    // TODO ensure we are connected
    channel = await getOnboardingChannel();
  });

  const { form, errors, handleChange, handleSubmit } = createForm({
    initialValues: {
      most_important_in_life: profile.most_important_in_life || "",
      interests: profile.interests,
      first_date_idea: profile.first_date_idea || "",
      free_form: profile.free_form,
    },
    validationSchema: yup.object().shape({
      most_important_in_life: yup.string().required("обязательно"),
      interests: yup
        .array()
        .of(yup.string())
        .min(2)
        .max(5)
        .required("обязательны"),
      first_date_idea: yup.string().required("обязательно"),
      free_form: yup.string().nullable(),
    }),
    onSubmit: (values) => {
      channel
        .push("submit-about-self-info", { profile: values })
        .receive("ok", () => {
          // TODO we get profile here, we should store it?
          goto("/onboarding/tastes");
        })
        .receive("error", (e) => {
          console.log("error from channel", e);
        });
    },
  });
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

<svelte:head>
  <title>Since | Onboarding: About Self</title>
</svelte:head>
<!-- TODO prevent default? -->
<form on:submit={handleSubmit} class="p-8 space-y-4">
  <div>
    <label for="most_important_in_life">
      <span
        class="ml-8 text-xl font-semibold {$errors.most_important_in_life ? 'text-red-600' : ''}">главное
        в жизни</span>
      {#if $errors.most_important_in_life}
        <span
          class="text-xl text-red-400">{$errors.most_important_in_life}</span>
      {/if}
      <input
        type="text"
        name="most_important_in_life"
        id="most_important_in_life"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.most_important_in_life}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.most_important_in_life ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="саморазвитие" />
    </label>
  </div>

  <div class="custom-tags">
    <label for="interests">
      <span
        class="ml-8 text-xl font-semibold {$errors.interests ? 'text-red-600' : ''}">интересы</span>
      {#if $errors.interests}
        <span class="text-xl text-red-400">{$errors.interests}</span>
      {/if}
      <Tags
        on:tags={(e) => {
          $form.interests = e.detail.tags
            .toString()
            .split(',')
            .map((d) => d.trim());
        }}
        tags={profile.interests}
        name="interests"
        id="interests"
        allowBlur={true}
        maxTags={5}
        onlyUnique={true}
        placeholder="asdfasdf asdf " />
    </label>
  </div>

  <div>
    <label for="first_date_idea">
      <span
        class="ml-8 text-xl font-semibold {$errors.first_date_idea ? 'text-red-600' : ''}">первое
        свидание
      </span>
      {#if $errors.first_date_idea}
        <span class="text-xl text-red-400">{$errors.first_date_idea}</span>
      {/if}
      <input
        type="text"
        name="first_date_idea"
        id="first_date_idea"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.first_date_idea}
        class="w-full h-20 px-10 mt-2 text-4xl transition border-2 focus:ring rounded-full {$errors.first_date_idea ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}"
        placeholder="прогулка по Москве" />
    </label>
  </div>

  <div>
    <label for="free_form">
      <span
        class="ml-8 text-xl font-semibold {$errors.free_form ? 'text-red-600' : ''}">free
        form</span>
      {#if $errors.free_form}
        <span class="text-xl text-red-400">{$errors.free_form}</span>
      {/if}
      <textarea
        name="free_form"
        id="free_form"
        rows="5"
        on:change={handleChange}
        on:blur={handleChange}
        bind:value={$form.free_form}
        class="w-full px-10 mt-2 text-4xl transition border-2 focus:ring rounded-lg {$errors.free_form ? 'focus:ring-red-300 border-red-500 bg-red-100' : ''}" />
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
