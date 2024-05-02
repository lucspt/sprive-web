/**
 * Context for the current app's savior. 
 * 
 * A savior is a user, i.e a company or a user of the company
 * that is running a climate program.
 */
import { 
  PropsWithChildren,
  createContext, 
  useCallback,
  useMemo,
  useState
} from "react";
import { fetchWithAuth, getCookie } from "../../utils/utils";
import { fetchHeadersIncludeCookies  } from "../../constants";
import { useEffect } from "react";
import { Savior, SpriveResponse } from "../../types";
import { LoginFunction, SaviorContextSavior, SaviorContextValues } from "./types";

export const SaviorContext = createContext<null|SaviorContextValues>(null);
/**
 * This context provider wraps the whole app, providing the 
 * current user's account, and account utils to log in and out.
 * 
 * If there is no logged in user, it will cause `<SaviorRoute>` to redirect any request
 * containing `/savior` in the url back to the home root `/`
 * 
 * @param props
 * @param props.children - The app to render.
 * @returns Children elements wrapped by `SaviorContext.Provider`
*/
export default function SaviorContextProvider({ children }: PropsWithChildren) {
  
  const [ savior, setSavior ] = useState<SaviorContextSavior>(null);

  useEffect(() => {
    /**
     * On initial render, check that cookies exist 
     * and fetch the savior's account.
     * 
     * If no cookies or account redirect to `/`. 
     */
    if (savior === null) {
      if (getCookie("csrf_access_token")) {
        const getSavior = async () => {
          await fetchWithAuth(
            "saviors", {
              setState: ({ content }: SpriveResponse<Savior>) => {
                setSavior(content)
              },
              onUnauthorized: () => setSavior({})
            }
          )
        }
        getSavior();
      } else {
        setSavior({});
      }
    }
    return () => setSavior(null);
  }, [])

  const login = useCallback<LoginFunction>(async (e, onSuccess, setError) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const loginData = Object.fromEntries(data);
    try {
      const response = await fetch(
        "http://localhost:8000/partners/login", {
        headers: {
          ...fetchHeadersIncludeCookies,
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
        body: JSON.stringify(loginData),
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

  const logout = useCallback(async () => {
    await fetchWithAuth(
      "saviors/logout",
      { setState: (_) => setSavior({}), method: "DELETE", }
    );
  }, []);

  const context = useMemo<SaviorContextValues>(() => ({
      savior: savior || {},
      setSavior,
      login,
      logout,
  }), [savior]);

  return savior !== null && (
    <SaviorContext.Provider value={context}>
      { children }
    </SaviorContext.Provider>
  )
}