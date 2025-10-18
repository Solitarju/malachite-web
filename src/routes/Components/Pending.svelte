<script lang="ts">
    let { text }: { text: string } = $props();
</script>

<h1 class="text-white text-3xl font-mono m-2">{text}</h1><h1 class="text-white text-3xl font-mono animate-[loading_1s_linear_infinite]">...</h1>