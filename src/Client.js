const apiBaseUrlPrefix = "https://api";
const apiBaseUrlSuffix = ".vyte.in";

/**
 * @param {string} previous
 * @param {[string, string | number]} param1
 * @returns {string}
 */
 const reducer = (previous, [key, value]) => `${previous}${key}=${value}&`;

export default class Client {
  constructor(
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

  /**
   * @returns {string}
   */
  getBaseUrl() {
    if (this.env.length > 0 && this.env !== "prod") {
      return `${apiBaseUrlPrefix}-${this.env}${apiBaseUrlSuffix}`;
    }

    return apiBaseUrlPrefix + apiBaseUrlSuffix;
  }

  /**
   * @returns {void}
   */
  setUrl() {
    let query = {};

    if (this.team) {
      query["team"] = this.team;

      if (this.teamBooking) {
        query["tb"] = this.teamBooking;
      }

      if (this.teamAllMembers === "true") {
        query["team_all_members"] = true;
      }
    } else if (this.users) {
      query["users"] = encodeURIComponent(this.users);
    } else {
      query["emails"] = encodeURIComponent(this.emails);
    }

    if (this.availability) {
      query["availability_id"] = this.availability;
    }

    if (this.appointmentType) {
      query["appointment_type"] = this.appointmentType;
    }

    query["duration"] = this.duration;
    query["timezone"] = this.timezone;

    this.url = `${this.getBaseUrl()}/slots/days?${this.parseQuery(query)}`;
  }

  /**
   * @param {string} from 
   * @param {string} to 
   * @returns {Promise<Array>}
   */
  async list(from, to) {
    const url = `${this.url}&from=${from}&to=${to}`;
    const response = await fetch(url, { mode: "cors" });

    if (response.ok) {
      return await response.json();
    }

    console.log("Error", response.status);
    return [];
  }

  /**
   * @param {{[key: string]: string | number}} query
   * @returns {string}
   */
  parseQuery(query) {
    return Object.entries(query).reduce(reducer, '').slice(0, -1);
  }
}