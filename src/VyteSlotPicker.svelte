<script>
  import { onMount, createEventDispatcher } from "svelte";
  import DayPicker from "./DayPicker.svelte";
  import DaySlots from "./DaySlots.svelte";
  import Loading from "./Loading.svelte";
  import Client from "./Client";
  import dayjs from "dayjs";

  const dispatch = createEventDispatcher();

  /**
   * @type {number}
   */
  export let duration = 20;

  /**
   * @type {string}
   */
  export let emails = "";

  /**
   * @type {string}
   */
  export let users = "";

  /**
   * @type {string}
   */
  export let env = "prod";

  /**
   * @type {number}
   */
  export let ndays = 5;

  /**
   * @type {number}
   */
  export let nslots = 5;

  /**
   * @type {number}
   */
  export let oneColumn = false;

  /**
   * @type {string}
   */
  export let start = dayjs().format("YYYY-MM-DD");

  /**
   * @type {boolean}
   */
  export let startAtFirstAvailability = false;

  /**
   * @type {string}
   */
  export let team = "";

  /**
   * @type {string}
   */
  export let teamBooking = "";

  /**
   * @type {string}
   */
  export let teamAllMembers = "";

  /**
   * @type {string}
   */
  export let timezone;

  /**
   * @type {string}
   */
  export let availability = "";

  /**
   * @type {string}
   */
  export let appointmentType = "";

  /**
   * @type {Object}
   */
  let dailySlots = {};

  /**
   * @type {boolean}
   */
  let firstLoad = true;

  /**
   * @type {boolean}
   */
  let loading = true;

  /**
   * @type {number}
   */
  let maxSlots = 0;

  /**
   * @type {Object}
   */
  let nextAvailability = {};

  /**
   * @type {number}
   */
  let numberOfSlots = nslots;

  /**
   * @type {string}
   */
  let selectedDay = "";

  /**
   * @type {Object}
   */
  let selectedSlot = {};

  /**
   * @type {string}
   */
  let startDay = ensureNotPast(start);

  /**
   * @type {Client}
   */
  let client;

  /**
   * @type {boolean}
   */
  let isMounted = false;

  $: endDay = dayjs(startDay)
    .add(ndays - 1, "days")
    .format("YYYY-MM-DD");

  /**
   * The list of days displayed.
   * 
   * @type {Array<string>}
   */
  let days;
  $: {
    const _days = [];
    const start = dayjs(startDay);
    const format = "YYYY-MM-DD";
    _days.push(start.format(format));

    for (let i = 1; i < ndays; i++) {
      _days.push(start.add(i, "days").format(format));
    }

    days = _days;
  }

  $: moreSlotsAreAvailable = maxSlots > numberOfSlots;
  $: nextAvailableDate = nextAvailability.availableDate
    ? dayjs(nextAvailability.availableDate).format("MMMM D, YYYY")
    : "";

  let slotsForDays;
  $: {
    let _days = oneColumn ? [selectedDay] : days;
    let _maxSlots = 0;
    let _slotsForDays = {};

    if (dailySlots) {
      _days.map(day => {
        const daySlots = dailySlots[day];
        _slotsForDays[day] = [];

        if (daySlots) {
          const { slots } = daySlots;
          _slotsForDays[day] = slots;
          if (slots.length > _maxSlots) {
            _maxSlots = slots.length;
          }
        }
      });
    }

    maxSlots = _maxSlots;
    slotsForDays = _slotsForDays;
  }

  /**
   *
   * @param {Array} props
   * @returns {boolean}
   */
  function invalidProps(props) {
    for (const prop of props) {
      if (typeof prop === "string" && prop.indexOf("{{") >= 0) {
        return true;
      }
    }
    return false;
  }

  function getFirstSlots() {
    if (
      invalidProps([
        env,
        emails,
        users,
        duration,
        timezone,
        team,
        teamBooking,
        availability,
        teamAllMembers,
        appointmentType,
      ])
    ) {
      return;
    }

    if (
      client &&
      client.env === env &&
      client.emails === emails &&
      client.duration === duration &&
      client.timezone === timezone &&
      client.team === team &&
      client.teamBooking === teamBooking &&
      client.availability === availability &&
      client.teamAllMembers === teamAllMembers &&
      client.appointmentType === appointmentType
    ) {
      return; //do not run again if there are no changes
    }

    buildClient();
    getSlots();
  }

  function getSlots() {
    loading = true;
    client.list(startDay, endDay).then((data) => {
      dailySlots = data.days;
      nextAvailability = {};

      if (data.nextAvailability) {
        nextAvailability = data.nextAvailability;
        if (startAtFirstAvailability && firstLoad) {
          goToNextAvailability();
        }
      }

      if (firstLoad) {
        firstLoad = false;
      }

      if (oneColumn) {
        checkSelectedDay();
      }

      loading = false;
    });
  }

  /**
   * @param {number} direction
   * @returns {void}
   */
  function changeDays(direction) {
    startDay = ensureNotPast(
      dayjs(startDay)
        .add(direction * ndays, "days")
        .format("YYYY-MM-DD")
    );
  }

  function showMoreSlots() {
    numberOfSlots = maxSlots;
  }

  function goToNextAvailability() {
    startDay = nextAvailability.availableDate;
  }

  /**
   * Handle slot selection.
   *
   * @param {CustomEvent} event
   */
  function slotSelected(event) {
    selectedSlot = event.detail;
    const eventName = "slot-selected";
    dispatch(eventName, selectedSlot); //component level event

    const domEvent = new CustomEvent(eventName, {
      detail: selectedSlot,
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    document.dispatchEvent(domEvent); //dom level event
  }

  /**
   * Make sure that starting date is not in the past.
   *
   * @param {string} date
   * @returns {string}
   */
  function ensureNotPast(date) {
    if (dayjs(date).diff(dayjs().startOf("day"), "days") < 0) {
      return dayjs().format("YYYY-MM-DD");
    }

    return date;
  }

  /**
   * @returns {void}
   */
  function checkSelectedDay() {
    if (!dailySlots) {
      return;
    }

    let alternativeDay;
    for (const day of days) {
      if (dailySlots[day]) {
        // we have at least one slot on that day
        if (selectedDay === day) {
          // this day was already our selected slot
          return;
        }

        if (!alternativeDay) {
          alternativeDay = day;
        }
      }
    }

    selectedDay = alternativeDay; //our selectedDay wasn't one of the loaded days with slots so we pick the best alternative (if any)
  }

  /**
   * @param {CustomEvent} event
   */
  function daySelected(event) {
    selectedDay = event.detail;
  }

  function buildClient() {
    client = new Client(
      env,
      emails,
      users,
      duration,
      timezone,
      team,
      teamBooking,
      availability,
      teamAllMembers,
      appointmentType
    );
  }

  $: if (isMounted && (emails || duration || timezone || availability)) {
    getFirstSlots();
  }

  $: if (isMounted && startDay) {
    getSlots();
  }

  onMount(() => {
    buildClient();
    isMounted = true;
    dispatch("mount");
  });
</script>

<div class="c-slot-container">
  <DayPicker
    {days}
    on:dayselected={daySelected}
    on:nextdays={() => changeDays(1)}
    on:prevdays={() => changeDays(-1)}
    {oneColumn}
    {selectedDay}
  />
  {#if loading}
    <Loading />
  {:else}
    <div class="c-slot-days-container">
      {#each Object.entries(slotsForDays) as [key, slots] (`vyte-ds-${key}`)}
        <DaySlots
          nslots={numberOfSlots}
          {selectedSlot}
          {slots}
          on:slot-selected={slotSelected}
        />
      {/each}
    </div>

    {#if nextAvailableDate}
      <div class="c-slot-next-day" on:click={goToNextAvailability}>
        <div class="c-slot-centered">
          <span class="c-slot-btn">Next appointment on {nextAvailableDate}</span>
        </div>
      </div>
    {/if}

    {#if moreSlotsAreAvailable}
      <footer class="c-slot-footer">
        <a href={"#"} on:click|preventDefault={showMoreSlots}>
          View more slots
        </a>
      </footer>
    {/if}
  {/if}
</div>

<style>
  .c-slot-next-day {
    position: absolute;
    margin: auto;
    width: 100%;
    height: calc(100% - 43px);
    bottom: 0;
    text-align: center;
  }

  .c-slot-btn {
    color: white;
    background-color: #308ff0;
    cursor: pointer;
    padding: 10px;
    border-radius: 4px;
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
  }

  .c-slot-centered {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .c-slot-container {
    text-align: center;
    background: #ffffff;
    position: relative;
  }

  .c-slot-container * {
    box-sizing: border-box;
  }

  .c-slot-days-container {
    display: flex;
    flex-direction: row;
    padding: 8px max(30px, 5%);
    justify-content: space-around;
    box-sizing: border-box;
  }

  .c-slot-footer {
    background: white;
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    justify-content: center;
  }

  .c-slot-footer a {
    cursor: pointer;
    font-size: 12px;
    text-decoration: underline;
    color: #308ff0;
  }
</style>
