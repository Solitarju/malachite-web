<script lang="ts">
    import { DOMAIN }  from "$lib/index.svelte";
    import { page } from '$app/state';
    import InternalServerError from '../../Components/InternalServerError.svelte';
    import NotFound from '../../Components/NotFound.svelte';
    import Pending from '../../Components/Pending.svelte';
    import Verified from '../../Components/Verified.svelte';
    import PasswordReset from '../../Components/PasswordReset.svelte';

    let title = $state("Reset Password");
    let promise: Promise<Response> | undefined = $state();

    async function reset_password(password: string) {
        promise = fetch(`${DOMAIN}/password-reset/${page.params.token}`,
        {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(password),
        });

        promise.then(res => {
            if (res.status == 204) { title = "Success!" }
            else if (res.status == 404) { title = "Invalid Reset URL" }
            else { title = "Internal Server Error" };
        })
        .catch(() => {
            title = "Internal Server Error";
        })
    }
</script>

<svelte:head>
    <title>{title} - Malachite</title>
</svelte:head>

{#if promise}
    {#await promise}
        <Pending text="Changing your password"/>
    {:then res} 
        {#if res?.status == 204}
            <Verified text=
                "Your password was successfuly reset! Return to the Malachite Application to login.
                Please note all existing sessions have been invalidated, requiring you to re-authenticate."
            />
        {:else if res?.status == 404}
            <NotFound>
                Sorry, but this reset URL doesn't seem to exist in our database :(
                Password reset URLs expire after 1 hour, if you requested a password reset longer than 1 hour ago, please try again.
                If this is unexpected, or you're having trouble resetting your password, contact us at <a class="text-sky-400" href="mailto:support@solitarju.uk" aria-labelledby="email">support@solitarju.uk</a>
            </NotFound>
        {:else}
            <InternalServerError text=
                "Sorry, we encountered an error while trying to reset your password.
                We apologize for the inconvenience, we're probably working hard to fix it!
                Please notify us if we haven't acknowledged this error, and try again later."
            />
        {/if}
    {:catch}
        <InternalServerError text=
            "Sorry, we encountered an error while trying to reset your password.
            We apologize for the inconvenience, we're probably working hard to fix it!
            Please notify us if we haven't acknowledged this error, and try again later."
        />
    {/await}
{:else}
    <PasswordReset submit_callback={reset_password}/>
{/if}