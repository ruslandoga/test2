<script>
  let phoneNumberInput = "";
  let shared = false;
  let phoneNumber = "";
  let sharedPhoneNumbers = [];
  import { imask } from "svelte-imask";
  import { onMount } from "svelte";
  import { v4 as uuidv4 } from "uuid";

  let visitId = uuidv4();

  onMount(async () => {
    // TODO
    // window.onerror = function (msg, url, lineNo, columnNo, error) {
    //   var string = msg.toLowerCase();
    //   var substring = "script error";
    //   if (string.indexOf(substring) > -1) {
    //     alert("Script Error: See Browser Console for Detail");
    //   } else {
    //     var message = [
    //       "Message: " + msg,
    //       "URL: " + url,
    //       "Line: " + lineNo,
    //       "Column: " + columnNo,
    //       "Error object: " + JSON.stringify(error),
    //     ].join(" - ");

    //     alert(message);
    //   }

    //   return false;
    // };
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: visitId,
        meta: {
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          appVersion: navigator.appVersion,
          vendor: navigator.vendor,
          opera: window.opera,
          screen: [window.screen.availWidth, window.screen.availHeight],
          devicePixelRatio: window.devicePixelRatio,
        },
      }),
    };
    let path = `/api/visited`;
    await fetchPlus(path, options);
  });

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

  // TODO when page is opened, post to /api/opened with client info?
  async function fetchPlus(path, options = {}) {
    if (navigator.onLine) return fetch(path, options);
    alert(`This operation is not available while offline.`);
    return { offline: true };
  }

  async function sharePhone() {
    shared = "in-progress";
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phoneNumber,
        meta: {
          visit: visitId,
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          appVersion: navigator.appVersion,
          vendor: navigator.vendor,
          opera: window.opera,
          screen: [window.screen.availWidth, window.screen.availHeight],
          devicePixelRatio: window.devicePixelRatio,
        },
      }),
    };
    let path = `/api/share-phone`;
    let res = await fetchPlus(path, options);
    if (res.offline) return;
    if (!res.ok) throw new Error(await res.text());
    // // TODO save to local storage?
    if (res.ok) {
      sharedPhoneNumbers = [...sharedPhoneNumbers, phoneNumber];
      shared = true;
    } else {
      shared = "error";
    }

    setTimeout(() => {
      shared = false;
    }, 2000);
  }
</script>

<style>
  .radial-gradient {
    background: radial-gradient(
      41.63% 41.63% at 50% 50%,
      rgba(255, 211, 192, 0.7) 0%,
      rgba(217, 203, 194, 0) 100%
    );
  }

  .list-circle {
    list-style: circle;
  }
</style>

<svelte:head>
  <title>Since</title>
</svelte:head>

<main class="relative">
  <div
    class="z-20 flex flex-col items-center min-h-screen p-2 justify-evenly lg:justify-center sm:p-4">
    <div class="w-full max-w-sm px-10 mx-auto mt-10 md:max-w-md">
      <h1 class="font-serif text-7xl">Since</h1>
      <h2 class="text-xl md:text-2xl">новое приложение для тех</h2>
    </div>

    <ul
      class="flex flex-col flex-auto w-full max-w-sm px-10 mx-auto mt-8 space-y-4 text-lg lg:flex-none md:max-w-md justify-evenly md:text-xl list-circle">
      <li>кто ищет романтические отношения</li>
      <li>кто ценит свое время</li>
      <li>кому важна не только внешность</li>
      <li>кто хочет навсегда удалиться из приложений для знакомств</li>
    </ul>

    <form
      on:submit|preventDefault={sharePhone}
      disabled={!canSubmit}
      class="flex flex-col w-full max-w-xl px-6 pb-10 mt-10 space-y-3 sm:px-8 h-1/4">
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
  </div>

  <div
    class="absolute top-0 left-0 z-10 w-full h-full overflow-hidden pointer-events-none">
    <div
      class="w-full h-full transform -translate-x-1/2 -translate-y-1/2 radial-gradient" />
  </div>

  <div
    class="absolute bottom-0 right-0 z-10 w-1/2 h-full overflow-hidden pointer-events-none">
    <div class="w-full h-full transform translate-x-1/2 radial-gradient" />
  </div>
</main>
