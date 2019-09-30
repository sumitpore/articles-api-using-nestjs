export interface UserData {
  username: string;
  name: string;
  email: string;
  token: string;
  url: string;
  role: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}

export interface PublisherLogoData {
  image: string;
  width: number;
  height: number;
}

export interface PublisherData {
  name: string;
  url: string;
  logo: PublisherLogoData
}

export interface AuthorData {
  name: string;
  url: string;
}