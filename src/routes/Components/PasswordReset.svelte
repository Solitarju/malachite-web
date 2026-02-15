<script lang="ts">
    import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
    import { onMount } from 'svelte';

    // svelte-ignore non_reactive_update
    let input_0: HTMLInputElement;
    let input_1: HTMLInputElement;

    let input_0_has_value = $state();
    let inputs_match = $state();

    let { submit_callback }: { submit_callback: (password: string) => Promise<void> } = $props();
    let password_strength: number = $state(-1);
    let password_strength_readable = $state("None");
    let feedback: string[] = $state(["Password must be between 8 and 64 characters long"]);

    function set_feedback(zx_feedback: Array<string>) {
        let feedback_result: Array<string> = [];

        if (input_0.value.length < 8 || input_0.value.length > 64) {
            feedback_result.push("Password must be between 8 and 64 characters long");
        }

        if (input_0.value != input_1.value) {
            feedback_result.push("Passwords must match");
        }

        feedback = feedback_result.concat(zx_feedback);
    }

    function password_strength_to_readable(strength: number | undefined) {
        switch (strength) {
            case -1:
                password_strength_readable = "None";
                break;
            case 0:
                password_strength_readable = "Very Poor";
                break;
            case 1:
                password_strength_readable = "Poor";
                break;
            case 2:
                password_strength_readable = "Okay";
                break;
            case 3:
                password_strength_readable = "Good";
                break;
            case 4:
                password_strength_readable = "Very Good";
                break;
        }
    }

    async function check_password(password: string) {
        let result = password.length == 0 ? undefined : zxcvbn(password);

        if (result) {
            password_strength = result.score.valueOf();
            set_feedback(result.feedback.suggestions);
        } else {
            password_strength = -1;
            set_feedback([]);
        }

        password_strength_to_readable(password_strength);
    }

    async function password_input(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
        if (event.currentTarget.value == '') { input_0_has_value = false } else { input_0_has_value = true };
        if (input_0.value == input_1.value) { inputs_match = true } else { inputs_match = false };
        await check_password(input_0.value);
    }

    // lazy load (after page mount) zxcvbn language dictionaries since they are large, and it is recommended.
    onMount(async () => {
        const zxcvbnCommonPackage = await import(
            /* webpackChunkName: "zxcvbnCommonPackage" */ '@zxcvbn-ts/language-common'
        )

        const zxcvbnEnPackage = await import(
            /* webpackChunkName: "zxcvbnEnPackage" */ '@zxcvbn-ts/language-en'
        )

        let opts = {
            translations: zxcvbnEnPackage.translations,
            graphs: zxcvbnCommonPackage.adjacencyGraphs,
            dictionary: {
                ...zxcvbnCommonPackage.dictionary,
                ...zxcvbnEnPackage.dictionary,
            },
        };

        zxcvbnOptions.setOptions(opts);
    })
</script>

<div class="flex border-zinc-800 bg-zinc-900 border-2 rounded-2xl pl-5 pr-5 overflow-none">
    <div>
        <div class="flex h-10 overflow-none mt-6 justify-center items-center">
            <h1 class="text-zinc-200 text-4xl font-medium font-mono m-2 ml-0 mr-0">Reset Password</h1>
        </div>
        <div class="flex flex-col justify-center gap-4 mt-6">
            <input bind:this={input_0} oninput={password_input} type="password" placeholder="Enter New Password" class="focus:outline-2 outline-mint bg-zinc-950 border-zinc-800 border-2 text-white font-mono w-lg h-10 rounded-lg pl-4">
            <input bind:this={input_1} oninput={password_input} type="password" placeholder="Confirm New Password" class="focus:outline-2 outline-mint bg-zinc-950 border-zinc-800 border-2 text-white font-mono w-lg h-10 rounded-lg pl-4">
        </div>
        <div>
            <!-- Not sure about this, need more opinions -->
            <!-- <div class={{
                "h-1 border-0 rounded-3xl mt-2": true,
                "bg-zinc-500": password_strength == -1,
                "bg-red-500": password_strength == 0,
                "bg-red-400": password_strength == 1,
                "bg-orange-400": password_strength == 2,
                "bg-green-400": password_strength == 3,
                "bg-mint": password_strength == 4,
            }}></div> -->
            <h2 class="text-zinc-200 font-mono text-sm mt-2">Password Strength: <p class={
                {
                    "inline-block": "inline-block",
                    "text-zinc-500": password_strength == -1,
                    "text-red-500": password_strength == 0,
                    "text-red-400": password_strength == 1,
                    "text-orange-400": password_strength == 2,
                    "text-green-400": password_strength == 3,
                    "text-mint": password_strength == 4,
                }
            }>{password_strength_readable}</p></h2>
            {#if feedback}
                <ul class="list-disc list-inside">
                    {#each feedback as feedback}
                        <li class="text-zinc-200 font-mono text-sm">{feedback}</li>
                    {/each}
                </ul>
            {/if}
        </div>
        {#if inputs_match && input_0_has_value && input_0.value.trim().length >= 8}
            <button class="bg-mint text-zinc-950 text-sm font-mono w-lg h-8 rounded-md mt-4 mb-4 cursor-pointer" onclick={async () => await submit_callback(input_0.value)}>Reset Password</button>
        {:else}
            <button class="bg-zinc-500 text-zinc-950 text-sm font-mono w-lg h-8 rounded-md mt-4 mb-4">Reset Password</button>
        {/if}
    </div>
</div>