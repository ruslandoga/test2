<script>
  import { imask } from "svelte-imask";
  import { createEventDispatcher } from "svelte";
  import { savePhone } from "utils";

  const dispatch = createEventDispatcher();

  export let visit_id;
  export let referral_code;
  export let shared = false;

  let phoneNumber = "";
  let phoneNumberInput = "";
  let sharedPhoneNumbers = [];

  const maskOptions = {
    mask: "+{7} (000) 000-00-00",
  };

  function phoneComplete({ detail: imask }) {
    phoneNumber = imask._unmaskedValue;
  }

  $: canSubmit =
    isValidPhoneNumber(phoneNumber) &&
    shared === false &&
    !sharedPhoneNumbers.includes(phoneNumber);

  function isValidPhoneNumber(phoneNumber) {
    // TODO
    return phoneNumber.length === 11;
  }

  async function sharePhone() {
    shared = "in-progress";

    let res = await savePhone({ phoneNumber, visit_id, referral_code });

    if (res.offline) return;
    if (!res.ok) throw new Error(await res.text());

    // // TODO save to local storage?
    if (res.ok) {
      sharedPhoneNumbers = [...sharedPhoneNumbers, phoneNumber];
      shared = true;

      setTimeout(() => {
        shared = false;
      }, 2000);
      dispatch("shared", {});
    } else {
      shared = "error";
    }
  }
</script>

<form
  on:submit|preventDefault={sharePhone}
  disabled={!canSubmit}
  class="flex flex-col w-full max-w-xl px-6 mx-auto mt-12 space-y-3 sm:px-8 h-1/4">
  <div
    class="flex flex-col w-full space-y-4 sm:space-y-0 sm:space-x-2 sm:flex-row">
    <div class="relative sm:w-1/2">
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-6 h-6 text-gray-600"><rect
            x="5"
            y="2"
            width="14"
            height="20"
            rx="2"
            ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" /></svg>
      </div>
      <input
        required
        type="tel"
        use:imask={maskOptions}
        on:accept={phoneComplete}
        placeholder="мобильный телефон"
        class="w-full pr-2 text-gray-800 transition duration-150 border border-gray-700 rounded-full focus:ring-4 ring-opacity-50 pl-14 focus:ring-pink-100 focus:border-black h-14 md:pr-4"
        bind:value={phoneNumberInput} />
    </div>
    <button
      class="w-full h-14 px-2 transition duration-150 border-2 rounded-full sm:px-4 sm:w-1/2 bg-black text-white border-black {canSubmit ? '' : 'cursor-not-allowed opacity-25'}"
      disabled={!canSubmit}>
      {#if shared === true}
        👍
      {:else if shared === 'in-progress'}
        ...
      {:else if shared === 'error'}👎{:else}это про меня *{/if}
    </button>
  </div>
  <div class="max-w-xs px-4 mx-auto sm:max-w-sm md:max-w-md">
    <span class="text-sm leading-3 text-gray-400">* мы отправим ссылку на
      приложение в январе 2021 г.</span>
  </div>
</form>
