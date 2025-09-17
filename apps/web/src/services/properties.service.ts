import { api, uploadFile } from '@/lib/axios';
import {
  Property,
  CreatePropertyRequest,
  UpdatePropertyRequest,
  PropertySearchQuery,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

export interface PropertyFilters {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bed?: number;
  from?: string;
  to?: string;
}

export interface PropertyPagination {
  page?: number;
  limit?: number;
}

export interface PropertySort {
  sortBy?: 'price' | 'createdAt' | 'title' | 'bed';
  sortOrder?: 'asc' | 'desc';
}

export interface PropertySearchParams extends PropertyFilters, PropertyPagination, PropertySort {}

/**
 * Properties service for handling property/hotel operations
 */
export class PropertiesService {
  private readonly basePath = '/properties';

  /**
   * Get all properties with optional pagination
   */
  async getProperties(params?: PropertyPagination & PropertySort): Promise<PaginatedResponse<Property>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

    const response = await api.get<PaginatedResponse<Property>>(url);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch properties');
    }

    return response;
  }

  /**
   * Get single property by ID
   */
  async getProperty(id: string): Promise<Property> {
    const response = await api.get<ApiResponse<Property>>(`${this.basePath}/${id}`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Property not found');
    }

    return response.data;
  }

  /**
   * Create new property
   */
  async createProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    // Handle file upload separately if image is provided
    let imageUrl: string | undefined;

    if (propertyData.image) {
      try {
        const uploadResponse = await uploadFile(
          `${this.basePath}/upload-image`,
          propertyData.image
        );
        imageUrl = uploadResponse.url;
      } catch (error) {
        throw new Error('Failed to upload property image');
      }
    }

    // Create property data without the image file
    const { image, ...propertyPayload } = propertyData;
    const dataToSend = {
      ...propertyPayload,
      ...(imageUrl && { imageUrl }),
    };

    const response = await api.post<ApiResponse<Property>>(
      this.basePath,
      dataToSend
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create property');
    }

    return response.data;
  }

  /**
   * Update existing property
   */
  async updateProperty(id: string, updates: UpdatePropertyRequest): Promise<Property> {
    // Handle file upload separately if image is provided
    let imageUrl: string | undefined;

    if (updates.image) {
      try {
        const uploadResponse = await uploadFile(
          `${this.basePath}/upload-image`,
          updates.image
        );
        imageUrl = uploadResponse.url;
      } catch (error) {
        throw new Error('Failed to upload property image');
      }
    }

    // Update property data without the image file
    const { image, ...updatePayload } = updates;
    const dataToSend = {
      ...updatePayload,
      ...(imageUrl && { imageUrl }),
    };

    const response = await api.put<ApiResponse<Property>>(
      `${this.basePath}/${id}`,
      dataToSend
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update property');
    }

    return response.data;
  }

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`${this.basePath}/${id}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete property');
    }
  }

  /**
   * Search properties with filters
   */
  async searchProperties(searchParams: PropertySearchParams): Promise<PaginatedResponse<Property>> {
    const queryParams = new URLSearchParams();

    // Add search filters
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.priceMin !== undefined) queryParams.append('priceMin', searchParams.priceMin.toString());
    if (searchParams.priceMax !== undefined) queryParams.append('priceMax', searchParams.priceMax.toString());
    if (searchParams.bed !== undefined) queryParams.append('bed', searchParams.bed.toString());
    if (searchParams.from) queryParams.append('from', searchParams.from);
    if (searchParams.to) queryParams.append('to', searchParams.to);

    // Add pagination
    if (searchParams.page) queryParams.append('page', searchParams.page.toString());
    if (searchParams.limit) queryParams.append('limit', searchParams.limit.toString());

    // Add sorting
    if (searchParams.sortBy) queryParams.append('sortBy', searchParams.sortBy);
    if (searchParams.sortOrder) queryParams.append('sortOrder', searchParams.sortOrder);

    const response = await api.get<PaginatedResponse<Property>>(
      `${this.basePath}/search?${queryParams.toString()}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to search properties');
    }

    return response;
  }

  /**
   * Get properties posted by current user
   */
  async getUserProperties(params?: PropertyPagination & PropertySort): Promise<PaginatedResponse<Property>> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}/user?${queryString}` : `${this.basePath}/user`;

    const response = await api.get<PaginatedResponse<Property>>(url);

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch user properties');
    }

    return response;
  }

  /**
   * Check property availability for specific dates
   */
  async checkAvailability(propertyId: string, from: string, to: string): Promise<boolean> {
    const params = new URLSearchParams({
      from,
      to,
    });

    const response = await api.get<ApiResponse<{ available: boolean }>>(
      `${this.basePath}/${propertyId}/availability?${params.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to check availability');
    }

    return response.data.available;
  }

  /**
   * Get property statistics for owner
   */
  async getPropertyStats(propertyId: string): Promise<{
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    occupancyRate: number;
  }> {
    const response = await api.get<ApiResponse<{
      totalBookings: number;
      totalRevenue: number;
      averageRating: number;
      occupancyRate: number;
    }>>(`${this.basePath}/${propertyId}/stats`);

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch property statistics');
    }

    return response.data;
  }

  /**
   * Get featured properties
   */
  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    const response = await api.get<ApiResponse<Property[]>>(
      `${this.basePath}/featured?limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch featured properties');
    }

    return response.data;
  }

  /**
   * Get nearby properties based on location
   */
  async getNearbyProperties(
    propertyId: string,
    radius: number = 10,
    limit: number = 6
  ): Promise<Property[]> {
    const response = await api.get<ApiResponse<Property[]>>(
      `${this.basePath}/${propertyId}/nearby?radius=${radius}&limit=${limit}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch nearby properties');
    }

    return response.data;
  }

  /**
   * Toggle property active status
   */
  async togglePropertyStatus(propertyId: string, active: boolean): Promise<Property> {
    const response = await api.patch<ApiResponse<Property>>(
      `${this.basePath}/${propertyId}/status`,
      { active }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update property status');
    }

    return response.data;
  }

  /**
   * Upload multiple property images
   */
  async uploadPropertyImages(propertyId: string, images: File[]): Promise<string[]> {
    const uploadPromises = images.map(image =>
      uploadFile(`${this.basePath}/${propertyId}/images`, image)
    );

    try {
      const results = await Promise.all(uploadPromises);
      return results.map(result => result.url);
    } catch (error) {
      throw new Error('Failed to upload property images');
    }
  }

  /**
   * Delete property image
   */
  async deletePropertyImage(propertyId: string, imageUrl: string): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(
      `${this.basePath}/${propertyId}/images`,
      {
        data: { imageUrl }
      }
    );

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete property image');
    }
  }
}

// Create singleton instance
export const propertiesService = new PropertiesService();

// Export instance as default
export default propertiesService;