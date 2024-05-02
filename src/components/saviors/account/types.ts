import { Savior, SaviorAccountRole } from "../../../types";

export interface CompanyData {
  teams: string[],
  tree: Savior[],
}

export interface AccountBannerProps {
  region: string, 
  website: string, 
  joinedDate: string | Date,
  name: string,
  company: string,
  role: SaviorAccountRole
};

export interface CompanyMembersCardProps {
  members: Savior[], 
  companyTeams: string[],
  fetcher: any,
  currentUserId: string,
};

export interface ProfileCardProps {
  bio: string, 
  email: string,
  role: string,
  username: string,
  picture: string
}

export interface ProfilePictureProps {
  username?: string,
  picture?: string,
  size?: number | string,
  className?: string,
}