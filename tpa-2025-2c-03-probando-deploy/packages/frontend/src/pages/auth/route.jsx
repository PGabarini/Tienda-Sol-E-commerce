export const route = {
  path: "/auth",
  children: [
    {
      path: "login",
      lazy: () => import("./login/page")
    },
    {
      path: "register",
      lazy: () => import("./register/page")
    }
  ]
}