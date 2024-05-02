import "./ProfilePicture.css";
import { ProfilePictureProps } from "./types";

const getInitialsFromUsername = (username: string) => (
  username
  .split(" ")
  .slice(0, 2)
  .map(x => x.charAt(0))
  .join("")
  .toUpperCase()
)
export function ProfilePicture({ username, picture, size, className }: ProfilePictureProps) {

  return (picture || username) && (
    <div className={`profile-picture ${className}`}>
      {
        picture ? (
          <img src={picture} />
        ) : username && (
          <div className="default" style={{ padding: size, width: size, height: size }}>
            <span>{ getInitialsFromUsername(username) }</span>
          </div>
        )
      }
    </div>
  )
}