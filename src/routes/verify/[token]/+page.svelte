<script lang="ts">
    import { DOMAIN } from '$lib/index.svelte';
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    import InternalServerError from '../../Components/InternalServerError.svelte';
    import NotFound from '../../Components/NotFound.svelte';
    import Pending from '../../Components/Pending.svelte';
    import Verified from '../../Components/Verified.svelte';

    let title = $state("Verifying Your Email");
    let promise: Promise<Response> = $state(new Promise(() => {}));

    // fetch promise is set in onMount so that the browser doesn't prefetch to see if fetch is permitted with CORS, dont change this.
    onMount(() => {
        promise = fetch(`${DOMAIN}/verify/${page.params.token}`, { method: 'DELETE' });

        // update page title
        promise.then(res => {
            if (res.status == 204) { title = "Account Verified" }
            else if (res.status == 404) { title = "Verification Token Invalid" }
            else { title = "Internal Server Error" };
        })
        .catch(() => {
            title = "Internal Server Error";
        });
    })
</script>

<svelte:head>
    <title> - Malachite</title>
</svelte:head>

{#await promise}
	<Pending text="Verifying your email"/>
{:then res} 
	{#if res?.status == 204}
        <Verified text=
            "Your account and email are now verified!
            Return to the Malachite Application to login."
        />
    {:else if res?.status == 404}
        <NotFound>
            Sorry, but this verification URL doesn't seem to exist in our database :(
            Verification URLs expire after 24 hours, if you registered longer than 24 hours ago, please try again.
            If this is unexpected, or you're having trouble confirming your email, contact us at <a class="text-sky-400" href="mailto:support@solitarju.uk" aria-labelledby="email">support@solitarju.uk</a>
        </NotFound>
    {:else}
        <InternalServerError text=
            "Sorry, we encountered an error while trying to verify your email.
            We apologize for the inconvenience, we're probably working hard to fix it!
            Please notify us if we haven't acknowledged this error, and try again later."
        />
    {/if}
{:catch}
    <InternalServerError text=
        "Sorry, we encountered an error while trying to verify your email.
        We apologize for the inconvenience, we're probably working hard to fix it!
        Please notify us if we haven't acknowledged this error, and try again later."
    />
{/await}