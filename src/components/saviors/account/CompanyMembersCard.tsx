import { useEffect, useState } from "react";
import { ProfilePicture } from "../account/ProfilePicture";
import { BaseInput } from "../../inputs/base/BaseInput";
import "./CompanyMembersCard.css";
import DropdownPicker from "../../inputs/picker/DropdownPicker";
import { SideModal } from "../../modals/SideModal";
import { CompanyMembersCardProps } from "./types";
import { SaviorAccountRole } from "../../../types";

/**
 * Component that renders the company's members, along with a button to invite new members.
 */
export function CompanyMembersCard(
  { members, companyTeams, fetcher, currentUserId }: CompanyMembersCardProps
) {
  const [ showInviteModal, setShowInviteModal ] = useState<boolean>(false);
  const [ inviteRole, setInviteRole ] = useState<SaviorAccountRole | "">("");
  const [ assignedTeam, setAssignedTeam ] = useState<null|string>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data === true) {
      setShowInviteModal(false);
    }
  }, [fetcher]);

  const teamsDropdownValues = (
    companyTeams.filter(x => x).map(team => ({label: team, value: team}))
    // filter truthy values and format for DropdownPicker
  );

  const _members = members.filter(x => x._id !== currentUserId);
  return (
    <div className="account-card users company-card">
      <h3>Company users</h3>
      <div className="pictures-row" data-testid="company-users">
        {
          _members.length > 0
          ?
            _members.map(({ username, picture }, i) => (
               <ProfilePicture username={username} picture={picture} size={24} key={i}/>
            ))
          : <span className="faded-text">No members invited</span>
        }

      </div>
      <div className="invite">
        <button className="default-btn invite-btn" onClick={() => setShowInviteModal(true)}>
          Add users
        </button>
      </div>
      <SideModal visible={showInviteModal} close={() => setShowInviteModal(false)} title="Invite a user">
        <fetcher.Form method="POST" action=".">
          <p className="desc">
            Use this form to add a new user to your climate program.
            Once you submit, they will be able to log into their account with the info entered here.
          </p>
          <BaseInput name="email" label="Enter email" required/>
          <BaseInput name="username" label="Enter full name" required/>
          <BaseInput name="password" label="Enter password" required/>
          <div className="pickers">
            <DropdownPicker 
              values={[
                {label: "Company", value: "company"}, 
                {label: "User", value: "user"}
              ]} 
              label="Choose permissions" 
              required
              name="role"
              value={inviteRole}
              onChange={setInviteRole}
            />
            <DropdownPicker 
              values={teamsDropdownValues} 
              label="Assign to team (optional)" 
              noneOption 
              name="team"
              value={assignedTeam}
              onChange={setAssignedTeam}
              noneOptionValue={null}
            />
          </div>
          <div className="submit">
            <button type="submit" className="default-btn">Invite user</button>
          </div>
        </fetcher.Form>
      </SideModal>
    </div>
  )
}