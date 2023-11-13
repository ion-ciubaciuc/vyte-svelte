<div class="days-container">
    <slot />
</div>

<style>
    .days-container {
        display: flex;
        gap: 4px;
        position: relative;
        flex-direction: row;
        padding: 8px max(30px, 5%);
        justify-content: space-around;
        box-sizing: border-box;
    }
</style>
