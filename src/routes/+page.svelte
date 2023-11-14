<script lang="ts">
    import VyteSlotPicker from '$lib/VyteSlotPicker.svelte';

    const slotSelectedHandler = (event: CustomEvent) => alert(JSON.stringify(event.detail));
</script>

<svelte:head>
    <title>Vyte Slot Picker</title>
</svelte:head>

<VyteSlotPicker
    timezone="Europe/Paris"
    emails="martin@vytein.com"
    on:slot-selected={slotSelectedHandler}
/>
