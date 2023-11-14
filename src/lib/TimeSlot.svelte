<script lang="ts">
    import dayjs from 'dayjs';
    import { createEventDispatcher } from 'svelte';
    import type { Slot } from './client';

    export let useLocale = true;
    export let tslot: Slot | undefined;
    export let selectedSlot: Slot | undefined;

    $: isSelected = tslot && selectedSlot?.start.dateTime === tslot.start.dateTime;

    const dispatch = createEventDispatcher<{ 'slot-selected': Slot }>();
    const handleClick = () => dispatch('slot-selected', tslot as Slot);

    const time = (dt: string) => {
        if (useLocale) {
            const [dtWithoutTz] = dt.split('+');
            return dayjs(dtWithoutTz).format('HH:mm').toLowerCase();
        }

        const [time] = dt.split('T');
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };
</script>

{#if tslot}
    <button class="slot-time" on:click={handleClick} class:selected={isSelected}>
        {time(tslot.start.dateTime)}
    </button>
{:else}
    <div class="slot-time unavailable">—</div>
{/if}

<style>
    .slot-time {
        --bg-color: #edf3ff;
        --bg-color-hover: #e6ecf8;
        width: 100%;
        border: none;
        cursor: pointer;
        box-sizing: border-box;
        font-style: normal;
        font-weight: normal;
        line-height: normal;
        text-align: center;
        background: var(--bg-color);
        font-size: var(--font-size);
        padding: var(--button-padding);
        border-radius: var(--button-radius);
    }

    .slot-time:hover {
        background: var(--bg-color-hover);
    }

    .slot-time.unavailable {
        background: none;
        cursor: not-allowed;
    }

    .slot-time.selected {
        background: var(--color-blue);
        color: var(--color-white);
        font-weight: bold;
    }
</style>
