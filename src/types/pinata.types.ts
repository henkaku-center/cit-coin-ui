export interface PinataPinnedResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}

export interface HenkakuPinataPinnedResponse {
  name: string,
  description: string,
  image: string,
  attributes: object[]
}
export interface NftPinResponse {
  tokenUri: string,
  nft: HenkakuPinataPinnedResponse
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
