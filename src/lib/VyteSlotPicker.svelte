<script lang="ts">
    import dayjs from 'dayjs';
    import { onMount } from 'svelte';
    import Client from './client';
    import Divider from './Divider.svelte';
    import Loading from './Loading.svelte';
    import DaySlots from './DaySlots.svelte';
    import DayPicker from './DayPicker.svelte';
    import type { VyteData, Slot } from './client';
    import DaysContainer from './DaysContainer.svelte';
    import NextAppoinment from './NextAppoinment.svelte';

    export let duration = 30;
    export let emails = '';
    export let users = '';
    export let env = 'prod';
    export let ndays = 5;
    export let nslots = 5;
    export let oneColumn = false;
    export let start = dayjs().format('YYYY-MM-DD');
    export let startAtFirstAvailability = false;
    export let team = '';
    export let teamBooking = '';
    export let teamAllMembers = false;
    export let timezone: string;
    export let availability = '';
    export let appointmentType = '';

    /**
     * Make sure that starting date is not in the past.
     */
    const ensureNotPast = (date: string) => {
        if (dayjs(date).diff(dayjs().startOf('day'), 'days') < 0) {
            return dayjs().format('YYYY-MM-DD');
        }
        return date;
    };

    let dailySlots: VyteData['days'] = {};
    let firstLoad = true;
    let loading = true;
    let maxSlots = 0;
    let nextAvailability: VyteData['nextAvailability'] = undefined;
    let nrOfSlots = nslots;
    let selectedDay = '';
    let selectedSlot: Slot | undefined;
    let startDay = ensureNotPast(start);
    let client: Client;
    let isMounted = false;

    /**
     * The list of days displayed.
     */
    let days: string[];
    let slotsForDays: Record<string, Slot[]>;

    const formatDays = (startDate: string, nrOfDays: number) => {
        const start = dayjs(startDate);
        return Array.from({ length: nrOfDays }).map((_, i) =>
            start.add(i, 'days').format('YYYY-MM-DD')
        );
    };

    $: endDay = dayjs(startDay)
        .add(ndays - 1, 'days')
        .format('YYYY-MM-DD');

    $: days = formatDays(startDay, ndays);

    $: moreSlotsAreAvailable = maxSlots > nrOfSlots;
    $: nextAvailableDate = nextAvailability
        ? dayjs(nextAvailability.availableDate).format('MMMM D, YYYY')
        : '';

    $: {
        let _days = oneColumn ? [selectedDay] : days;
        let _maxSlots = 0;
        let _slotsForDays = {} as typeof slotsForDays;

        _days.forEach((day) => {
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

        maxSlots = _maxSlots;
        slotsForDays = _slotsForDays;
    }

    const invalidProps = (props: unknown[]) => {
        for (const prop of props) {
            if (typeof prop === 'string' && prop.indexOf('{{') >= 0) {
                return true;
            }
        }
        return false;
    };

    const getFirstSlots = () => {
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
                appointmentType
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
    };

    const getSlots = () => {
        loading = true;
        client
            .list(startDay, endDay)
            .then((data) => {
                dailySlots = data.days;
                nextAvailability = data.nextAvailability;
                if (startAtFirstAvailability && firstLoad) {
                    goToNextAvailability();
                }
                if (firstLoad) {
                    firstLoad = false;
                }
                if (oneColumn) {
                    checkSelectedDay();
                }
            })
            .catch(console.error)
            .finally(() => (loading = false));
    };

    const changeDays = (direction: number) => {
        const date = dayjs(startDay)
            .add(direction * ndays, 'days')
            .format('YYYY-MM-DD');
        startDay = ensureNotPast(date);
    };

    const showMoreSlots = () => {
        nrOfSlots = maxSlots;
    };

    const goToNextAvailability = () => {
        startDay = nextAvailability?.availableDate as string;
    };

    const handleSlotSelected = (event: CustomEvent) => {
        selectedSlot = event.detail;
    };

    const checkSelectedDay = () => {
        let alternativeDay = '';
        for (const day of days) {
            // we don't have any slot on this day or it was already selected
            if (!dailySlots[day] || selectedDay === day) continue;
            alternativeDay = day;
            break;
        }
        // our selectedDay wasn't one of the loaded days with slots so we pick the best alternative (if any)
        if (alternativeDay) {
            selectedDay = alternativeDay;
        }
    };

    const daySelected = (event: CustomEvent) => {
        selectedDay = event.detail;
    };

    const buildClient = () => {
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
    };

    $: if (isMounted && (emails || duration || timezone || availability)) {
        getFirstSlots();
    }

    $: if (isMounted && startDay) {
        getSlots();
    }

    onMount(() => {
        buildClient();
        isMounted = true;
    });
</script>

<div class="slot-container">
    <DaysContainer>
        <DayPicker
            {days}
            on:dayselected={daySelected}
            on:nextdays={() => changeDays(1)}
            on:prevdays={() => changeDays(-1)}
            {oneColumn}
            {selectedDay}
        />
    </DaysContainer>
    <Divider />
    {#if loading}
        <Loading />
    {:else}
        <DaysContainer>
            {#each Object.entries(slotsForDays) as [key, slots] (`vyte-ds-${key}`)}
                <DaySlots
                    {slots}
                    {nrOfSlots}
                    {selectedSlot}
                    on:slot-selected={handleSlotSelected}
                    on:slot-selected
                />
            {/each}
            {#if nextAvailableDate}
                <NextAppoinment date={nextAvailableDate} on:click={goToNextAvailability} />
            {/if}
        </DaysContainer>
        {#if moreSlotsAreAvailable}
            <footer class="slot-footer">
                <a href={'#'} on:click|preventDefault={showMoreSlots}>View more slots</a>
            </footer>
        {/if}
    {/if}
</div>

<style>
    .slot-container * {
        box-sizing: border-box;
    }

    .slot-container {
        --button-radius: 4px;
        --button-padding: 8px 12px;
        --color-white: #ffffff;
        --color-blue: #308ff0;
        --color-black: #464e55;
        --color-gray: #7b8394;
        --font-size: 12px;

        text-align: center;
        position: relative;
        background: var(--color-white);
        border: 1px solid #d8dfe6;
        border-radius: var(--button-radius);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.125);
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
            Geneva, Verdana, sans-serif;
    }

    .slot-footer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        background: var(--color-white);
        font-size: var(--font-size);
        padding: 10px 0;
        font-weight: 600;
        text-align: center;
        width: 100%;
    }

    .slot-footer a {
        cursor: pointer;
        font-size: var(--font-size);
        text-decoration: underline;
        color: var(--color-blue);
    }
</style>
