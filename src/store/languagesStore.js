import { makeAutoObservable, runInAction } from "mobx";
import { API_URL } from "../config/api";

class LanguagesStore {
  languages = [
    { code: "en", name: "English" },
    { code: "ua", name: "Ukrainian" },
    { code: "sk", name: "Slovak" },
  ];
  isLoading = false;
  hasFetched = false;
  // True once the first fetch has finished, successfully or not - lets
  // callers wait for the real list without waiting forever on a failure.
  settled = false;

  constructor() {
    makeAutoObservable(this);
  }

  async refresh() {
    this.hasFetched = false;
    await this.fetchLanguages();
  }

  async fetchLanguages() {
    if (this.hasFetched || this.isLoading) return;
    this.isLoading = true;
    try {
      const response = await fetch(`${API_URL}/languages`);
      const data = await response.json();
      runInAction(() => {
        this.languages = data;
        this.hasFetched = true;
      });
    } catch (error) {
      console.error("Error fetching languages:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.settled = true;
      });
    }
  }
}

const languagesStore = new LanguagesStore();
export default languagesStore;
