export const authService = {
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem("cv_user")) || null;
    } catch {
      return null;
    }
  },

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem("cv_users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) throw new Error("Email hoặc mật khẩu không chính xác");

    const info = { ...user };
    delete info.password;
    localStorage.setItem("cv_user", JSON.stringify(info));
    return info;
  },

  register: (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("cv_users") || "[]");
    if (users.find((u) => u.email === email)) {
      throw new Error("Email này đã được đăng ký tài khoản");
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      avatar: "avatar1",
      joinedAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("cv_users", JSON.stringify(users));

    const info = { ...newUser };
    delete info.password;
    localStorage.setItem("cv_user", JSON.stringify(info));
    return info;
  },

  logout: () => {
    localStorage.removeItem("cv_user");
  },

  updateProfile: (updates) => {
    const current = authService.getCurrentUser() || {};
    const updated = { ...current, ...updates };
    localStorage.setItem("cv_user", JSON.stringify(updated));

    // Cập nhật cả trong danh sách users
    try {
      const users = JSON.parse(localStorage.getItem("cv_users") || "[]");
      const idx = users.findIndex((u) => u.id === current.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updates };
        localStorage.setItem("cv_users", JSON.stringify(users));
      }
    } catch {
      // bỏ qua
    }

    return updated;
  },
};
