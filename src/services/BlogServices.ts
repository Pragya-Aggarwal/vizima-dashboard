import api from '../lib/axiosInstance';

export interface CreateBlogPayload {
  title: string;
  content: string;
  category: string;
  seoTitle?: string;
  metaDescription?: string;
  tags?: string[];
  isPublished: boolean;
  featuredImage: File;
}

interface BlogResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const createBlog = async (data: CreateBlogPayload): Promise<BlogResponse> => {
  try {
    const formData = new FormData();
    
    // Append all fields to formData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'tags' && Array.isArray(value)) {
          formData.append('tags', JSON.stringify(value));
        } else if (key === 'featuredImage' && value instanceof File) {
          formData.append('featuredImage', value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const response = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      message: 'Blog created successfully',
      data: response.data
    };
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create blog',
    };
  }
};

export const getBlogs = async (params?: any): Promise<BlogResponse> => {
  try {
    const response = await api.get('/blogs', { params });
    return {
      success: true,
      message: 'Blogs fetched successfully',
      data: response.data
    };
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch blogs',
    };
  }
};
