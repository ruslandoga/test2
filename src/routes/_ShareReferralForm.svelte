<script>
  export let visit_id;
  // visited with this referral_code
  export let referral_code;
  export let can_copy;

  import debounce from "lodash/debounce";
  import { isCodeAvailalbe, saveCode } from "utils";
  import { onMount } from "svelte";
  import ClipboardJS from "clipboard";

  let button;
  let buttonMessage;
  let code = "";
  let codeAvailable = true;
  let checkingAvailability = false;
  let copying = false;
  let showCopied = false;
  let copiedCodes = [];

  onMount(() => {
    // TODO destroy?
    new ClipboardJS(button);
  });

  $: validCode = code.trim().length >= 1 && code.trim().length <= 40;
  $: copyDisabled =
    !can_copy ||
    showCopied ||
    !validCode ||
    checkingAvailability ||
    copying ||
    !codeAvailable;

  $: {
    if (can_copy) {
      if (showCopied) {
        buttonMessage = "👍";
      } else {
        if (validCode) {
          if (checkingAvailability || copying) {
            buttonMessage = "...";
          } else {
            if (codeAvailable) {
              buttonMessage = "копировать ссылку";
            } else {
              buttonMessage = "такая уже есть";
            }
          }
        } else {
          buttonMessage = "копировать ссылку";
        }
      }
    } else {
      buttonMessage = "сначала телефон ^^";
    }
  }

  const handleInput = debounce(async (e) => {
    code = e.target.value.trim();
    checkingAvailability = true;

    codeAvailable = copiedCodes.includes(code)
      ? true
      : await isCodeAvailalbe(code);

    checkingAvailability = false;
  }, 300);

  const handleClick = async () => {
    copying = true;

    if (!copiedCodes.includes(code)) {
      await saveCode(code, visit_id, referral_code);
      copiedCodes = [...copiedCodes, code];
    }

    copying = false;
    showCopied = true;
    setTimeout(() => {
      showCopied = false;
    }, 2000);
  };
</script>

<form
  on:submit|preventDefault
  class="flex flex-col w-full max-w-xl px-6 mx-auto mt-10 space-y-3 sm:px-8 h-1/4">
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
          class="w-6 h-6 text-gray-600"><path
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      </div>
      <input
        required
        type="text"
        name="code"
        id="code"
        placeholder="ivan"
        class="w-full pr-2 text-gray-800 transition duration-150 border border-gray-700 rounded-full focus:ring-4 ring-opacity-50 pl-14 focus:ring-pink-100 focus:border-black h-14 md:pr-4"
        on:input={handleInput}
        on:keydown={() => (checkingAvailability = true)} />
    </div>
    <button
      bind:this={button}
      data-clipboard-text={'https://getsince.app/?code=' + encodeURIComponent(code)}
      on:click={handleClick}
      class="w-full h-14 px-2 transition duration-150 border-2 rounded-full sm:px-4 sm:w-1/2 bg-black text-white border-black {copyDisabled ? 'cursor-not-allowed opacity-25' : ''}"
      disabled={copyDisabled}>
      {buttonMessage}
    </button>
  </div>
</form>
