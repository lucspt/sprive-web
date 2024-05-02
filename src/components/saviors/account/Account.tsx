import { useContext, useEffect, useState } from "react"
import { SaviorContext } from "../../../contexts/savior/SaviorContext"
import "./Account.css";
import { AccountBanner } from "./AccountBanner";
import { ProfileCard } from "./ProfileCard";
import { CompanyMembersCard } from "./CompanyMembersCard";
import { fetchWithAuth } from "../../../utils/utils";
import { useFetcher } from "react-router-dom";
import { Savior, SpriveResponse } from "../../../types";
import { CompanyData } from "./types";
import { SaviorContextValues } from "../../../contexts/savior/types";

/**
 * The component which renders the /saviors/account route content.
 * 
 */
export function Account() {
  const { logout, savior, } = useContext(SaviorContext) as SaviorContextValues;
  const { 
    company, 
    website, 
    username, 
    region, 
    joined, 
    savior_id,
    bio, 
    email,
    role,
    picture
 } = savior as Savior;

  const [ companyData, setCompanyData ] = useState<CompanyData|null>(null)
  const fetcher = useFetcher();

  useEffect(() => {
    if (role === "company" || (fetcher.state === "idle" && fetcher.data === true)) {
        async function getCompanyTree() {
          const res = await Promise.all([
            fetchWithAuth("saviors/company-tree"),
            fetchWithAuth("saviors/company-teams"),
          ]) as SpriveResponse[];
          setCompanyData({
            tree: res[0].content,
            teams: res[1].content
          });
        }
        getCompanyTree();
    }
  }, [role, fetcher]);

  return (role !== "company" || companyData !== null) && (
    <div className="account page">
      <AccountBanner region={region} website={website} joinedDate={joined} name={username} company={company} role={role}/>
      <section className="grid-layout">
        <ProfileCard bio={bio} email={email} role={role} username={username} picture={picture}/>
        {
          role === "company" && companyData && (
          <CompanyMembersCard 
            currentUserId={savior_id}
            members={companyData.tree} 
            fetcher={fetcher}
            companyTeams={companyData.teams}
          />
          )
        }
      </section>
      <div className="logout">
        <button onClick={logout} className="default-btn">Logout</button>
      </div>
    </div>
  )
}