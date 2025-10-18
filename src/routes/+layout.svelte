<script lang="ts">
	import favicon from "$lib/favicon.png";
	import '../app.css';
	let { children } = $props();
</script>

<main class="flex bg-zinc-950 justify-center items-center w-dvw h-dvh">
	<img class="absolute top-4 left-4 h-16 w-16" src={favicon} alt="icon">
	{@render children()}
</main>
