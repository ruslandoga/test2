<script>
  export let href;
  export let disabled = false;
</script>

<div class="fixed w-64 h-20 bottom-10 right-10">
  <a
    {href}
    {disabled}
    class="flex items-center justify-center w-full h-full transition bg-green-300 rounded  bottom-10 hover:bg-red-200 hover:shadow-md right-10"><svg
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
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg></a>
</div>
