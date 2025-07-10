import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Eye, Image as ImageIcon, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LoadingIndicator from "@/src/common/LoadingIndicator/loading"
import Image from "next/image"
import { City } from "@/types/city"

type CityListProps = {
    data: City[];
    isLoading: boolean;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
};

const CityList = ({ data: cities, isLoading, onEdit, onDelete, onView }: CityListProps) => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>City Name</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-6">
                                <LoadingIndicator />
                            </TableCell>
                        </TableRow>
                    ) : cities?.length > 0 ? (
                        cities.map((city) => (
                            <TableRow key={city._id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {city.imageUrl ? (
                                            <Image
                                                src={city.imageUrl}
                                                alt={city.name}
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                                                <ImageIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-medium">{city.name}</div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <MapPin className="h-3 w-3" />
                                                {city.name}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm">{city.order}</p>
                                </TableCell>
                                <TableCell>
                                   {city.createdAt}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(city._id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(city._id)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => onDelete(city._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                No cities found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default CityList