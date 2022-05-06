<script>
  import HeaderDay from "./HeaderDay.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  /**
   * @type {Array}
   */
  export let days;

  /**
   * @type {boolean}
   */
  export let oneColumn;

  /**
   * @type {string}
   */
  export let selectedDay;

  $: isToday = new Date(days[0]).toDateString() === new Date().toDateString();

  /**
   * @param {string} day
   */
  function daySelected(day) {
    dispatch("dayselected", day);
  }
</script>

<header class="c-slot-dates-selector">
  {#if !isToday}
    <div class="c-slot-arrow c-slot-prev" on:click={() => dispatch("prevdays")}>
      <img src="https://assets-cdn.vyte.in/wc/vyte-slot-picker/assets/cSlot-arrow-left.svg" alt="back">
    </div>
  {/if}

  {#each days as date, i (`vyte-hd-${date}-${i}`)}
    <HeaderDay
      {date}
      {oneColumn}
      {selectedDay}
      on:selected={() => daySelected(date)}
    />
  {/each}

  <div class="c-slot-arrow c-slot-next" on:click={() => dispatch("nextdays")}>
    <img src="https://assets-cdn.vyte.in/wc/vyte-slot-picker/assets/cSlot-arrow-right.svg" alt="next">
  </div>
</header>

<style>
  .c-slot-dates-selector {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #dde2ed;
    padding: 8px max(30px, 5%);
    position: relative;
    box-sizing: border-box;
  }

  .c-slot-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    position: absolute;
    width: auto;
    padding: 8px 12px;
  }

  .c-slot-arrow.c-slot-prev {
    left: 0;
  }

  .c-slot-arrow.c-slot-next {
    right: 0;
  }
</style>
