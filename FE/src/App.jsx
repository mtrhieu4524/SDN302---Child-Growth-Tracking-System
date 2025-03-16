import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoute from "./routes/Routes";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoute />
      </AuthProvider>
    </div>
  );
}

export default App;
