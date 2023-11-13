const apiBaseUrlPrefix = 'https://api';
const apiBaseUrlSuffix = '.vyte.in';

export type TimeSlot = {
    start: { dateTime: string };
    end: { dateTime: string };
};

export type VyteData = {
    timezone: string;
    from: string;
    to: string;
    nextAvailability?: {
        availableDate: string;
        availableSlot: TimeSlot;
    };
    days: Record<string, { slots: TimeSlot[] }>;
};

export default class Client {
    duration: number;
    emails: string;
    users: string;
    env: string;
    team: string;
    teamBooking: string;
    teamAllMembers: boolean;
    timezone: string;
    availability: string;
    appointmentType: string;
    url = '';

    constructor(
        env: string,
        emails: string,
        users: string,
        duration: number,
        timezone: string,
        team: string,
        teamBooking: string,
        availability: string,
        teamAllMembers: boolean,
        appointmentType: string
    ) {
        this.env = env;
        this.emails = emails;
        this.users = users;
        this.duration = duration;
        this.timezone = timezone;
        this.team = team;
        this.teamBooking = teamBooking;
        this.availability = availability;
        this.teamAllMembers = teamAllMembers;
        this.appointmentType = appointmentType;
        this.setUrl();
    }

    getBase() {
        if (this.env.length > 0 && this.env !== 'prod') {
            return `${apiBaseUrlPrefix}-${this.env}${apiBaseUrlSuffix}`;
        }

        return `${apiBaseUrlPrefix}${apiBaseUrlSuffix}`;
    }

    setUrl() {
        const url = new URL('/slots/days', this.getBase());

        url.searchParams.set('duration', `${this.duration}`);
        url.searchParams.set('timezone', this.timezone);

        if (this.team) {
            url.searchParams.set('team', this.team);

            if (this.teamBooking) {
                url.searchParams.set('tb', this.teamBooking);
            }

            if (this.teamAllMembers) {
                url.searchParams.set('team_all_members', 'true');
            }
        } else if (this.users) {
            url.searchParams.set('users', this.users);
        } else {
            url.searchParams.set('emails', this.emails);
        }

        if (this.availability) {
            url.searchParams.set('availability_id', this.availability);
        }

        if (this.appointmentType) {
            url.searchParams.set('appointment_type', this.appointmentType);
        }

        this.url = url.toString();
    }

    async list(from: string, to: string) {
        const url = `${this.url}&from=${from}&to=${to}`;
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) {
            throw `Error ${response.status}`;
        }
        return (await response.json()) as VyteData;
    }
}
