import { ProfilePicture } from "../account/ProfilePicture";
import { Link } from "react-router-dom";
import { ProfileCardProps } from "./types";

/**
 * Info about the current user's profiel.
 */
export function ProfileCard({ bio, email, role, username, picture }: ProfileCardProps) {

  return (
    <div className="account-card">
      <div className="picture-wrapper">
        <ProfilePicture username={username} picture={picture} size="var(--fontsize-lg)"/>
        <div className="edit">
          <h2>
            { role === "company" ? "Profile" : "Your Profile" }
            </h2>
          <Link to="edit" className="edit default-btn">edit</Link>
        </div>
      </div>
      <div className="info">
        <div className="editable">
          <h3>Bio</h3>
          {
            bio 
            ? <p>{ bio }</p>
            : <p className="faded-text">No bio</p>
          }
        </div>
        <div className="editable">
          <h3>Email</h3>
          <p>{ email }</p>
        </div>
      </div>
    </div>
  )
}