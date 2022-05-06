<script>
  import { createEventDispatcher } from "svelte";
  import dayjs from "dayjs";

  const dispatch = createEventDispatcher();

  /**
   * @type {Object}
   */
  export let selectedSlot;

  /**
   * @type {Object}
   */
  export let tslot;

  /**
   * @type {boolean}
   */
  export let useLocale = true;

  $: isValid = tslot.start.dateTime !== undefined;
  $: isSelected = isValid && selectedSlot.start?.dateTime === tslot.start.dateTime;

  /**
   * Format datetime string to hours and minutes.
   *
   * @param {string} dt
   * @returns {string}
   *
   * @example 14:50
   */
  function time(dt) {
    if (useLocale) {
      const [dtWithoutTz] = dt.split("+");
      return dayjs(dtWithoutTz).format("HH:mm").toLowerCase();
    }

    const [time] = dt.split("T");
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  }

  /**
   * Handle time slot selection.
   */
  function handleClick() {
    if (isValid) {
      dispatch("slot-selected", tslot);
    }
  }
</script>

<div on:click={handleClick}>
  {#if isValid}
    <div class="c-slot-time" class:selected={isSelected}>
      {time(tslot.start.dateTime)}
    </div>
  {:else}
    <div class="c-slot-time unavailable">—</div>
  {/if}
</div>

<style>
  .c-slot-time {
    font-style: normal;
    font-weight: normal;
    line-height: normal;
    font-size: 12px;
    text-align: center;
    background: #edf3ff;
    border-radius: 4px;
    padding: 8px 10px;
    margin: 2px 0;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
  }

  .c-slot-time:hover {
    background: #e6ecf8;
  }

  .c-slot-time.unavailable {
    background: none;
    color: #dde2ed;
    cursor: not-allowed;
  }

  .c-slot-time.selected {
    background: #308ff0;
    color: white;
    font-weight: bold;
  }
</style>
