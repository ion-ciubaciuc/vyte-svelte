<script lang="ts">
    export let date: string;
</script>

<div class="next-day-container">
    <button class="next-day" on:click>
        Next appointment on {date}
    </button>
</div>

<style>
    .next-day-container {
        display: grid;
        place-items: center;
        position: absolute;
        inset: 0;
    }

    .next-day {
        border: none;
        cursor: pointer;
        color: var(--color-white);
        background: var(--color-blue);
        border-radius: var(--button-radius);
        padding: var(--button-padding);
    }
</style>
