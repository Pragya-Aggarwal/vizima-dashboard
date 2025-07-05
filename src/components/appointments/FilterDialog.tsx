import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { GetScheduleVisitsParams } from "../../services/ScheduleVisitService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: Omit<GetScheduleVisitsParams, 'page' | 'limit'>
  onFilterChange: (filters: Omit<GetScheduleVisitsParams, 'page' | 'limit'>) => void
  onReset: () => void
  onApply: () => void
}

export function FilterDialog({
  open,
  onOpenChange,
  filters,
  onFilterChange,
  onReset,
  onApply
}: FilterDialogProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleApply = () => {
    onFilterChange(localFilters)
    onApply()
  }

  const handleReset = () => {
    onReset()
    setLocalFilters({
      status: "all",
      propertyId: "",
      dateFrom: "",
      dateTo: "",
      search: ""
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Appointments</DialogTitle>
          <DialogDescription>
            Filter appointments by status, date range, and more.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={localFilters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value || "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !localFilters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateFrom ? (
                      format(new Date(localFilters.dateFrom), "PPP")
                    ) : (
                      <span>From date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateFrom ? new Date(localFilters.dateFrom) : undefined}
                    onSelect={(date) => handleFilterChange("dateFrom", date?.toISOString().split('T')[0] || "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !localFilters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateTo ? (
                      format(new Date(localFilters.dateTo), "PPP")
                    ) : (
                      <span>To date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateTo ? new Date(localFilters.dateTo) : undefined}
                    onSelect={(date) => handleFilterChange("dateTo", date?.toISOString().split('T')[0] || "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="propertyId">Property ID</Label>
            <Input
              id="propertyId"
              placeholder="Filter by property ID"
              value={localFilters.propertyId || ""}
              onChange={(e) => handleFilterChange("propertyId", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
