export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Post {
  id: string
  title: string
  content: string
  author: User
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
