import Cookies from "js-cookie";

export default function getUserObject() {
  const user = Cookies.get("user_info");
  return user ? JSON.parse(user) : {};
}
