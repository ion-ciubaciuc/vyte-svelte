# Vyte slot picker for Svelte

This is a ported version of the Vue.js web component to integrate the Vyte slot picker directly in your website. It's fully configurable component with the following props:

## Properties

-   `emails`

    -   _Type_: `string`
    -   _Required_: `true`
    -   _Details_: If no users are passed. Email of the person whose availabilities you want to show (Vyte account required). You can pass a list of emails by comma separating them. Slots returned will be slots when all of those users are available.

-   `users`

    -   _Type_: `string`
    -   _Required_: `true`
    -   _Details_: If no emails are passed. Vyte `user._id` of the person whose availabilities you want to show (Vyte account required). You can pass a list of user_ids by comma separating them. Slots returned will be slots when all of those users are available.

-   `availability`

    -   _Type_: `string`
    -   _Required_: `false`
    -   _Details_: The `_id` of a specific availability you want to use for those slots. This availability could match a specific appointment type, for instance.

-   `ndays`

    -   _Type_: `number`
    -   _Details_: Default is 5. Number of days you want the view to show.

-   `timezone`

    -   _Type_: `string`
    -   _Required_: `true`
    -   _Details_: The timezone you want the availabilities displayed in. It must be expressed according to [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

-   `duration`
    -   _Type_: `string`
    -   _Details_: Default is 30. Duration in minutes.

<!--
- `lang`
  - _Type_: `string`
  - _Details_: Default is English. Language and locale of the component. It is expressed according to [ISO 639-1](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1) and the available languages are: `fr`, `en`, `es`, `it`, `pt`, `de`, `sv`, `nl`.
-->

-   `oneColumn`

    -   _Type_: `boolean`
    -   _Details_: Default is false. If you want the slots to be displayed on 1 column (vs 1 column per day).

-   `start`

    -   _Type_: `date`
    -   _Details_: Defaults to today. Start date expressed according to [ISO 8601](https://fr.wikipedia.org/wiki/ISO_8601).

-   `startAtFirstAvailability`

    -   _Type_: `boolean`
    -   _Details_: Default is false. If you want the first date to jump to the first day that has an available slot.

-   `nslots`
    -   _Type_: `number`
    -   _Details_: Number of slots max shown per day by default. The user can then click on a "view more slots" button to see all the slots available.

```html
<script>
    import { VyteSlotPicker } from 'vyte-slot-picker-svelte';

    const slotSelectedHandler = (event) => {
        alert(JSON.stringify(event.detail));
    };
</script>

<VyteSlotPicker
    timezone="Europe/Paris"
    emails="martin@vytein.com"
    on:slot-selected="{handleSlotSelected}"
>
</VyteSlotPicker>
```
