import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../../store/authStore";
import "./RegistrationForm.css";
import { useTranslation } from "react-i18next";

// Public self-registration was removed: POST /users on the server now
// requires an authenticated admin, and staff accounts are created from the
// admin panel (Users tab) instead. This form is login-only.
const AuthForm = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate("/edit");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;
    try {
      await authStore.login(username, password);
      navigate("/edit");
    } catch (error) {
      if (error.message === "user_not_found") {
        alert(t("authForm.feedbacks.userNotFound"));
      } else {
        alert(t("authForm.feedbacks.invalidPassword"));
      }
    }
  };

  return (
    <div className="reg-auth">
      <form className="reg-auth-form" onSubmit={handleSubmit}>
        <h2 className="reg-auth-title">{t("authForm.auth")}</h2>

        <label className="reg-auth-label" htmlFor="auth-username">
          {t("authForm.username")}
        </label>
        <input
          id="auth-username"
          className="reg-auth-field"
          type="text"
          name="username"
          autoComplete="username"
          value={formData.username}
          onChange={handleInputChange}
        />

        <label className="reg-auth-label" htmlFor="auth-password">
          {t("authForm.password")}
        </label>
        <input
          id="auth-password"
          className="reg-auth-field"
          type="password"
          name="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleInputChange}
        />

        <button type="submit" className="reg-auth-submit">
          {t("authForm.login1")}
        </button>
        <button
          type="button"
          className="reg-auth-home"
          onClick={() => navigate("/")}
        >
          {t("authForm.toTheHomePage")}
        </button>
      </form>
    </div>
  );
});

export default AuthForm;
