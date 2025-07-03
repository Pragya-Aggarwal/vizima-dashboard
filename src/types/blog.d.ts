declare module '@/services/BlogServices' {
  import { CreateBlogPayload } from '../services/BlogServices';
  
  export const createBlog: (data: CreateBlogPayload) => Promise<{
    success: boolean;
    message: string;
    data?: any;
  }>;
  
  export const getBlogs: (params?: any) => Promise<{
    success: boolean;
    message: string;
    data?: any;
  }>;
}
