import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function HomePage() {
  const { user } = useContext(AuthContext);
  const getHour = () => {
    const hour = new Date().getHours();
    if (hour < 15) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  }

  return (
    <>
      <h1>
        {getHour()}
        {user ? `, ${user.username}.` : ""}
      </h1>
      <p>Tu té humea… y tu estantería te echa de menos.</p>
    </>
  )
}

export default HomePage;