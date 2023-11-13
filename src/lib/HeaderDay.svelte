<script lang="ts">
    import dayjs from 'dayjs';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let date: string;
    export let oneColumn: boolean;
    export let selectedDay: string;

    $: isSelected = oneColumn && date === selectedDay;
    $: isToday = date === dayjs().format('YYYY-MM-DD');

    const handleClick = () => oneColumn && dispatch('selected');

    /**
     * Get day and month.
     *
     * @example 14 Nov
     */
    const getDay = (date: string) => dayjs(date).format('DD MMM');

    /**
     * Get short week day name.
     *
     * @example Fri
     */
    const getWeekDay = (date: string) => dayjs(date).format('ddd');
</script>

<button
    class="day"
    class:today={isToday}
    class:clickable={oneColumn}
    class:selected={isSelected}
    on:click={handleClick}
>
    <span class="date-name">{getWeekDay(date)}</span>
    <span class="date-nb">{getDay(date)}</span>
</button>

<style>
    .day {
        cursor: default;
        text-align: center;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4px 0;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        background: transparent;
    }

    .day .date-name {
        font-size: 12px;
        line-height: 1;
        color: #7b8394;
    }

    .day .date-nb {
        font-size: 12px;
        font-weight: 600;
        color: #464e55;
    }

    .day.today .date-name,
    .day.today .date-nb {
        color: #308ff0;
    }

    .day.selected {
        background: #308ff0;
    }

    .day.selected .date-nb,
    .day.selected .date-name {
        color: white;
    }

    .day.clickable {
        cursor: pointer;
    }
</style>
