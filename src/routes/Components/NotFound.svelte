<script lang="ts">
    import icon from "$lib/help_24dp_EA3323_FILL1_wght400_GRAD0_opsz24.svg";
    import { type Snippet } from "svelte";
    let { children }: { children: Snippet } = $props();
</script>

<div class="flex h-52 bg-zinc-900 border-zinc-800 border-2 rounded-2xl pl-5 pr-10">
    <div class="flex items-center h-full mr-5">
        <img class="h-9/12" src={icon} alt="checkmark">
    </div>
    <div>
        <div class="block h-6/12 overflow-auto">
            <h1 class="text-white text-4xl font-mono m-2 mt-8">404 Not Found</h1>
        </div>
        <div class="block h-6/12 overflow-auto">
            <p class="text-zinc-300 text-1xl font-mono m-2 whitespace-pre-line">{@render children()}</p>
        </div>
    </div>
</div>