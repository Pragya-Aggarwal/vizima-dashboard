export interface City {
  _id: string;
  id?: string; // Keeping for backward compatibility
  name: string;
  imageUrl: string;
  isVisible: boolean;
  order: number;
  nearbyPlaces?: Array<{
    _id?: string;
    id?: string; // Keeping for backward compatibility
    name: string;
    description: string;
    imageUrl: string;
    order: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CityFormData {
  id?: string;
  name: string;
  imageUrl: string;
  isVisible: boolean;
  order: number;
  nearbyPlaces: Array<{
    id?: string;
    name: string;
    description: string;
    imageUrl: string;
    order: number;
  }>;
}

export interface CityModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cityId?: string | null;
  onSubmit: (data: CityFormData, onSuccess: () => void) => void;
}
