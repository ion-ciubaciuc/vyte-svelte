<script>
  import { createEventDispatcher } from "svelte";
  import dayjs from "dayjs";

  const dispatch = createEventDispatcher();

  /**
   * Displayed date.
   * 
   * @type {string}
   */
  export let date;

  /**
   * Show only one column.
   * 
   * @type {boolean}
   */
  export let oneColumn;

  /**
   * Currently selected day.
   * 
   * @type {string}
   */
  export let selectedDay;

  $: isSelected = oneColumn && date === selectedDay;
  $: isToday = date === dayjs().format("YYYY-MM-DD");

  /**
   * Day click handler.
   * 
   * @returns {void}
   */
  function handleClick() {
    if (oneColumn) {
      dispatch("selected");
    }
  }

  /**
   * Get day and month.
   * 
   * @param {string} date
   * @returns {string}
   * 
   * @example 14 Nov
   */
  function getDay(date) {
    return dayjs(date).format("DD MMM");
  }

  /**
   * Get short week day name.
   * 
   * @param {string} date
   * @returns {string}
   * 
   * @example Fri
   */
  function getWeekDay(date) {
    return dayjs(date).format("ddd");
  }
</script>

<div
  class="c-slot-day"
  class:clickable={oneColumn}
  class:selected={isSelected}
  class:today={isToday}
  on:click={handleClick}
>
  <span class="c-slot-date-name">{getWeekDay(date)}</span>
  <span class="c-slot-date-nb">{getDay(date)}</span>
</div>

<style>
  .c-slot-day {
    cursor: default;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 0;
    border-radius: 4px;
  }

  .c-slot-day .c-slot-date-name {
    font-size: 12px;
    line-height: 1;
    color: #7b8394;
  }

  .c-slot-day .c-slot-date-nb {
    font-size: 12px;
    font-weight: 600;
    color: #464e55;
  }

  .c-slot-day.today .c-slot-date-name,
  .c-slot-day.today .c-slot-date-nb {
    color: #308ff0;
  }

  .c-slot-day.selected {
    background: #308ff0;
  }

  .c-slot-day.selected .c-slot-date-nb,
  .c-slot-day.selected .c-slot-date-name {
    color: white;
  }

  .c-slot-day.clickable {
    cursor: pointer;
  }
</style>
