<script>
  // let name = "";
  // let extraNameClasses = "border-black focus:ring-gray-300 focus:bg-gray-100";
  import { onMount } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import { imask } from "svelte-imask";
  import * as yup from "yup";
  import { getOnboardingChannel } from "../../lib/utils";

  import { parse, isDate } from "date-fns";

  let channel;

  onMount(async () => {
    // TODO ensure we are connected
    channel = await getOnboardingChannel();
    channel.push("initial-profile", {}).receive("ok", ({ profile }) => {
      const {} = profile;
    });
  });

  const today = new Date();

  function parseDateString(value, originalValue) {
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
    initialValues: {
      name: "",
      gender: "",
      birthdate: "",
      height: "",
      home_city: "",
    },
    validationSchema: yup.object().shape({
      gender: yup
        .string()
        .oneOf(["M", "F"], "обязателен")
        .required("обязателен"),
      name: yup.string().required("обязательно"),
      birthdate: yup
        .date()
        .transform(parseDateString)
        .typeError("должна быть в формате '10/10/1990'")
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
      alert(JSON.stringify(values));
    },
  });

  $: console.log($state);
</script>

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
      placeholder="10/10/1990" />
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
    class="w-full h-20 {$isValid ? 'bg-green-200' : 'bg-gray-200 cursor-not-allowed'}">ДАЛЬШЕ</button>
</form>
