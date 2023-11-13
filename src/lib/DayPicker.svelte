<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import HeaderDay from './HeaderDay.svelte';

    export let days: string[];
    export let oneColumn: boolean;
    export let selectedDay: string;

    const arrowPrev = 'https://assets-cdn.vyte.in/wc/vyte-slot-picker/assets/cSlot-arrow-left.svg';
    const arrowNext = 'https://assets-cdn.vyte.in/wc/vyte-slot-picker/assets/cSlot-arrow-right.svg';
    const dispatch = createEventDispatcher<{
        dayselected: string;
        prevdays: undefined;
        nextdays: undefined;
    }>();
    const daySelected = (day: string) => dispatch('dayselected', day);

    $: isToday = new Date(days[0]).toDateString() === new Date().toDateString();
</script>

{#if !isToday}
    <button class="days-arrow days-prev" on:click={() => dispatch('prevdays')}>
        <img src={arrowPrev} alt="previous" />
    </button>
{/if}
{#each days as date, i (`vyte-hd-${date}-${i}`)}
    <HeaderDay {date} {oneColumn} {selectedDay} on:selected={() => daySelected(date)} />
{/each}
<button class="days-arrow days-next" on:click={() => dispatch('nextdays')}>
    <img src={arrowNext} alt="next" />
</button>

<style>
    .days-arrow {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: pointer;
        position: absolute;
        width: auto;
        padding: 8px 12px;
        border: none;
        background: transparent;
    }

    .days-prev {
        left: 0;
    }

    .days-next {
        right: 0;
    }
</style>
