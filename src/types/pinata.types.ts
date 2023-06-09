export interface PinataPinnedResponse {
  IpfsHash: string;
  pinSize: number;
  timestamp: string;
}

export interface FilePinned {
  ipfsUrl: string;
}

export interface Pinned {
  tokenUri: string;
}

export interface CachedJson {
  name: string;
  address: string;
  roles: string[];
  points: number;
  profilePicture: string;
  date: number;
  tokenUri: string;
}

export interface IPinRequest {
  address: `0x${string}`;
  points: number;
}
