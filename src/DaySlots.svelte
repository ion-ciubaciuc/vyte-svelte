<script>
  import { createEventDispatcher } from "svelte";
  import TimeSlot from "./TimeSlot.svelte";

  const dispatch = createEventDispatcher();

  /**
   * @type {Array}
   */
  export let slots;

  /**
   * @type {number}
   */
  export let nslots = 10;

  /**
   * @type {Object}
   */
  export let selectedSlot;

  /**
   * @type {Array}
   */
  let adjustedSlots;

  $: {
    /**
     * @type {Array}
     */
    let aslots = [];
    
    if (slots) {
      aslots = slots.slice(0, nslots);
    }

    while (aslots.length < nslots) {
      aslots.push({ start: {} });
    }

    adjustedSlots = aslots;
  }

  function slotSelected(event) {
    dispatch("slot-selected", event.detail);
  }
</script>

{#if slots}
  <div class="c-slot-day-slots">
    {#each adjustedSlots as slot, i (`vyte-ts-${i}`)}
      <TimeSlot 
        on:slot-selected={slotSelected} 
        tslot={slot} 
        {selectedSlot} 
      />
    {/each}
  </div>
{/if}

<style>
  .c-slot-day-slots {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    margin: 0 2px;
  }
</style>
