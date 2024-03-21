import { 
  createContext, useCallback, useMemo, useState
} from "react";
import { fetchData, allowHeaders, getCookie, isObjectEmpty } from "../utils";
import { useEffect } from "react";

export const SaviorContext = createContext();
export default function SaviorContextProvider({ children }) {
  const [ savior, setSavior ] = useState(null);
  const [ currentStats, setCurrentStats ] = useState({});

  useEffect(() => {
    if (savior === null) {
      if (getCookie("csrf_access_token")) {
        const getSavior = async () => {
          await fetchData(
            "saviors", "GET", {}, {}, setSavior, 401, () => setSavior({}), 
          );
        }
        getSavior();
      } else {
        setSavior({});
      }
    }

    return () => setSavior(null);
  }, [])

  const login = useCallback(async (e, onSuccess, setError) => {
    e.preventDefault();
    let loginData = new FormData(e.target);
    loginData = Object.fromEntries(loginData);
    try {
      const response = await fetch(
        "http://localhost:8000/partners/login", {
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
      let json = await response.json();
      const { content } = json;
      if (response.ok) {
        setError(false);
        setSavior(content);
        onSuccess();
      } else setError(content);
    } catch (e) {
      throw e
    }
  }, [])

  const logout = useCallback(() => {
    setSavior({});
  }, []);

  const getData = useCallback(async request => {
    console.log("context getting data now");
      const response = await fetchData(`saviors/data/${request}`);
      if (request === "overview" && !currentStats) {
        setCurrentStats(...res.content.stats);
      }
      console.log(response);
      return response;
  }, []);

  const isLoggedIn = getCookie("csrf_access_token") && !isObjectEmpty(savior);

  const context = useMemo(() => ({
    savior,
    setSavior,
    currentStats,
    isLoggedIn,
    login,
    getData,
}), [savior, currentStats]);

  return savior !== null && (
    <SaviorContext.Provider value={context}>
      { children }
    </SaviorContext.Provider>
  )
}