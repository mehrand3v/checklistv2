import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarIcon } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckIcon, Loader2 } from 'lucide-react';

const InspectionPage = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Handle form submission
  };

  const categories = [
    {
      id: 1,
      name: 'Category 1',
      items: [
        { id: 1, name: 'Item 1', categoryId: 1 },
        { id: 2, name: 'Item 2', categoryId: 1 },
      ],
    },
    {
      id: 2,
      name: 'Category 2',
      items: [
        { id: 3, name: 'Item 3', categoryId: 2 },
        { id: 4, name: 'Item 4', categoryId: 2 },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-2 sm:py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Inspection Checklist</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full sm:w-auto"
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Select Date
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Submit Inspection
              </>
            )}
          </Button>
        </div>
      </div>

      {showCalendar && (
        <div className="mb-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
      )}

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-lg sm:text-xl">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="space-y-2">
                {category.items.map((item) => (
                  <InspectionItem
                    key={item.id}
                    item={{ ...item, categoryId: category.id }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InspectionPage; 