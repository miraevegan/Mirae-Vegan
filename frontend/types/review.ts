// types/review.ts
export interface Review {
  _id: string
  userName: string
  rating: number
  comment: string
  createdAt: string

  image?: {
    url: string
    public_id: string
  }
}