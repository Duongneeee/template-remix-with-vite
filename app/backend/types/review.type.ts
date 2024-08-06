export interface ReviewRequest {
  id?: number
  shop: string;
  star: number;
  review: string;
  isClose?: boolean;
  createdAt?: Date | string
}

export interface ReviewCreate extends ReviewRequest{}

export interface ReviewUpdate extends ReviewRequest{
  id: number
}
