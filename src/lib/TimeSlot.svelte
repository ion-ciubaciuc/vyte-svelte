<script lang="ts">
    import dayjs from 'dayjs';
    import { createEventDispatcher } from 'svelte';
    import type { TimeSlot as Slot } from './Client';

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
    <button class="c-slot-time" on:click={handleClick} class:selected={isSelected}>
        {time(tslot.start.dateTime)}
    </button>
{:else}
    <div class="c-slot-time unavailable">—</div>
{/if}

<style>
    .c-slot-time {
        font-style: normal;
        font-weight: normal;
        line-height: normal;
        font-size: 12px;
        text-align: center;
        background: #edf3ff;
        border-radius: 4px;
        border: none;
        padding: 8px 10px;
        width: 100%;
        box-sizing: border-box;
        cursor: pointer;
    }

    .c-slot-time:hover {
        background: #e6ecf8;
    }

    .c-slot-time.unavailable {
        background: none;
        cursor: not-allowed;
    }

    .c-slot-time.selected {
        background: #308ff0;
        color: white;
        font-weight: bold;
    }
</style>
