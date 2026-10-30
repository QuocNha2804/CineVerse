export const authService = {
  getCurrentUser: () => JSON.parse(localStorage.getItem("cv_user")) || null,
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem("cv_users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) throw new Error("Sai email hoặc mật khẩu");
    const { password: _, ...info } = user;
    localStorage.setItem("cv_user", JSON.stringify(info));
    return info;
  },
  register: (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("cv_users") || "[]");
    if (users.find((u) => u.email === email))
      throw new Error("Email đã tồn tại");
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      avatar: "avatar1",
    };
    users.push(newUser);
    localStorage.setItem("cv_users", JSON.stringify(users));
    const { password: _, ...info } = newUser;
    localStorage.setItem("cv_user", JSON.stringify(info));
    return info;
  },
  logout: () => localStorage.removeItem("cv_user"),
  updateProfile: (updates) => {
    const current = authService.getCurrentUser();
    const updated = { ...current, ...updates };
    localStorage.setItem("cv_user", JSON.stringify(updated));
    return updated;
  },
};
