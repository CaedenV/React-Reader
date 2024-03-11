import Login from "./pages/login/loginPage";
import "./page.module.css";
import TopBar from "./components/TopBar/TopBar";

export default function Home() {
  return (
    <div class="main">
      <TopBar />
      <Login />
    </div>
  );
}
