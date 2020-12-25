<script>
  import { goto } from "@sapper/app";

  let phoneNumber = "";
  let code = "";
  let step = 1;

  $: disablePhoneInput = step > 1;
  $: showCodeInput = step === 2;
  $: canSubmitCode = code.length === 6;

  // TODO handle all failures is res is not ok, turn something red, show error and explain what the user can do next, don't just throw errors
  async function requestSms() {
    let res = await fetch("/api/auth/request-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: phoneNumber,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    // // TODO save to local storage?
    if (res.ok) {
      step = 2;
    }
  }

  async function verifyCode() {
    let res = await fetch("/api/auth/verify-phone-number", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: phoneNumber,
        code,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    // // TODO save to local storage?
    if (res.ok) {
      goto("/app");
    }
  }
</script>

<div class="p-8">
  <form on:submit|preventDefault={requestSms} disabled={disablePhoneInput}>
    <input
      type="tel"
      class={disablePhoneInput ? 'opacity-25' : ''}
      bind:value={phoneNumber}
      disabled={disablePhoneInput} />
    {#if !disablePhoneInput}
      <button type="submit" disabled={disablePhoneInput}>Gimme smsku!</button>
    {/if}
  </form>

  {#if showCodeInput}
    <form on:submit|preventDefault={verifyCode} disabled={!canSubmitCode}>
      <input type="text" bind:value={code} />
      <button
        type="submit"
        class={canSubmitCode ? '' : 'opacity-25'}
        disabled={!canSubmitCode}>Verify code</button>
    </form>
  {/if}
</div>
