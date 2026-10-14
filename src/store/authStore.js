import { makeAutoObservable, runInAction } from "mobx";
import { API_URL } from "../config/api";

// Keep the owner's/staff's own visits out of the site analytics: the Umami
// tracker skips sending when localStorage["umami.disabled"] is set. Toggle it
// with the authenticated state so a logged-in admin/moderator isn't counted as
// a visitor (regular visitors never authenticate, so they're always tracked).
function setAnalyticsDisabled(disabled) {
  try {
    if (disabled) localStorage.setItem("umami.disabled", "1");
    else localStorage.removeItem("umami.disabled");
  } catch (e) {
    /* ignore storage access errors */
  }
}

class AuthStore {
  isAuthenticated = false;
  isAdmin = false;
  isReady = false;
  user = null;

  constructor() {
    makeAutoObservable(this);
  }

  async checkAuth() {
    try {
      const response = await fetch(`${API_URL}/me`, { credentials: "include" });
      // Signed-out visitors get 200 with null (not a 401) - see server /me.
      const user = response.ok ? await response.json() : null;
      if (user) {
        runInAction(() => {
          this.isAuthenticated = true;
          this.isAdmin = user.role === "admin";
          this.user = user;
        });
        setAnalyticsDisabled(true);
      } else {
        runInAction(() => {
          this.isAuthenticated = false;
          this.isAdmin = false;
          this.user = null;
        });
        setAnalyticsDisabled(false);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      runInAction(() => {
        this.isReady = true;
      });
    }
  }

  async login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "invalid_credentials");
    }

    const user = await response.json();
    runInAction(() => {
      this.isAuthenticated = true;
      this.isAdmin = user.role === "admin";
      this.user = user;
    });
    setAnalyticsDisabled(true);
    return user;
  }

  async logout() {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    runInAction(() => {
      this.isAuthenticated = false;
      this.isAdmin = false;
      this.user = null;
    });
    setAnalyticsDisabled(false);
  }

  // Mirrors the server's requireStaff (admin OR moderator). Used to decide
  // whether to surface staff-only UI like the header's edit-panel link —
  // isAdmin alone wrongly hid it from moderators, who do have panel access.
  get isStaff() {
    return this.user?.role === "admin" || this.user?.role === "moderator";
  }

  get mustChangePassword() {
    return !!this.user?.must_change_password;
  }

  clearMustChangePassword() {
    if (this.user) {
      this.user = { ...this.user, must_change_password: false };
    }
  }
}

const authStore = new AuthStore();
export default authStore;
