import { useContext } from "react"
import { SaviorContext } from "../../../contexts/savior/SaviorContext";
import { Link } from "react-router-dom";
import { ProfilePicture } from "../account/ProfilePicture";
import { SaviorContextValues } from "../../../contexts/savior/types";
import { Savior } from "../../../types";

/**
 * Renders the current user's name and profile picture on `<DashboardRouter />`. 
 * On click this will go to the /saviors/account route. 
 * 
 * @returns The react component.
 */
export function CurrentUser() {
  const { savior } = useContext(SaviorContext) as SaviorContextValues<Savior>;
  const { company, username, picture } = savior;
  
  return (
    <Link className="account" to="./account">
      <div className="user">
        <ProfilePicture size={14} username={username} picture={picture}/>
        <div className="names">
          <span>{ username }</span>
          {/* { group && <span className="faded-text"> { group } </span> } */}
          <span className="faded-text">{ company } </span>
        </div>
      </div>
    </Link>
  )
}