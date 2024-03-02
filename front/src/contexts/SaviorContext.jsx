import { 
  createContext, useCallback, useMemo, useState
} from "react";
import { fetchData, allowHeaders, getCookie, isObjectEmpty } from "../utils";

export const SaviorContext = createContext();

export default function SaviorContextProvider({ children }) {
  const [ savior, setSavior ] = useState(JSON.parse(localStorage.getItem("savior")));
  const [ currentStats, setCurrentStats ] = useState({});
  const [ tasks, setTasks ] = useState({});

  const login = async (e, onSuccess, setError) => {
    e.preventDefault();
    let loginData = new FormData(e.target);
    loginData = Object.fromEntries(loginData);
    try {
      const response = await fetch(
        "http://localhost:8000/login", {
        method: "POST",
        body: JSON.stringify(loginData),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": allowHeaders
        },
        credentials: "include"
    });
      let res = await response.json();
      console.log(res)
      if (res.ok) {
        let { content } = res;
        setError(false);
        setSavior(content);
        localStorage.setItem("savior", JSON.stringify(content));
        onSuccess();
      } else setError(res.content);
    } catch (e) {
      console.log(e);
    }
  }
  const logout = useCallback(() => {
    setSavior({});
    localStorage.setItem("savior", "{}");
  }, []);

  const getData = useCallback(async request => {
    console.log("context getting data now");
      const response = await fetchData(`saviors/dashboard/${request}`);
      if (request === "overview" && !currentStats) {
        setCurrentStats(...res.content.stats);
      }
      console.log(response);
      return response;
  }, []);

  const getTasks = () => fetchData("saviors/tasks", "GET", {}, {}, setTasks);

  const isLoggedIn = useMemo(
    () => getCookie("csrf_access_token") && !isObjectEmpty(savior), 
    [savior, logout, login]
  );


  const context = useMemo(() => ({
    savior,
    setSavior,
    currentStats,
    isLoggedIn,
    tasks,
    login,
    logout,
    getData,
    getTasks,
}), [savior, currentStats, tasks]);

  return (
    <SaviorContext.Provider value={context}>
      { children }
    </SaviorContext.Provider>
  )
}