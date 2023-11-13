<script lang="ts">
    import TimeSlot from './TimeSlot.svelte';
    import type { TimeSlot as Slot } from './Client';

    export let nrOfSlots = 10;
    export let slots: Slot[];
    export let selectedSlot: Slot | undefined;

    const adjustSlots = (items: Slot[], nrOfItems: number) => {
        let adjusted: Array<Slot | undefined> = items.slice(0, nrOfItems);
        while (adjusted.length < nrOfItems) {
            adjusted.push(undefined);
        }
        return adjusted;
    };
</script>

<div class="day-slots">
    {#each adjustSlots(slots, nrOfSlots) as slot, i (`vyte-ts-${i}`)}
        <TimeSlot on:slot-selected tslot={slot} {selectedSlot} />
    {/each}
</div>

<style>
    .day-slots {
        display: flex;
        gap: 4px;
        flex-direction: column;
        box-sizing: border-box;
        width: 100%;
    }
</style>
