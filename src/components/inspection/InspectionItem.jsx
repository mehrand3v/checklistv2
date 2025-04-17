// src/components/inspection/InspectionItem.jsx
import React, { useState } from 'react';
import { useInspection } from '../../context/InspectionContext';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const InspectionItem = ({ item }) => {
  const { updateInspectionItem } = useInspection();
  const [notes, setNotes] = useState(item.notes || '');
  const [fixed, setFixed] = useState(item.fixed || false);

  const handleStatusChange = (newStatus) => {
    if (newStatus === item.status) return;
    
    const updatedItem = {
      ...item,
      status: newStatus,
      notes: newStatus === 'no' ? notes : '',
      fixed: newStatus === 'no' ? fixed : false
    };
    
    updateInspectionItem(updatedItem);
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    updateInspectionItem({
      ...item,
      notes: newNotes
    });
  };

  const handleFixedChange = (checked) => {
    setFixed(checked);
    updateInspectionItem({
      ...item,
      fixed: checked
    });
  };

  return (
    <div className="flex flex-col gap-2 p-2 rounded-lg border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-medium">{item.description}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <label className="flex-1 sm:flex-none">
            <input
              type="radio"
              name={`status-${item.id}`}
              value="yes"
              checked={item.status === 'yes'}
              onChange={() => handleStatusChange('yes')}
              className="sr-only"
            />
            <div className={`flex items-center justify-center px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              item.status === 'yes'
                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
            }`}>
              <span className="text-sm">Yes</span>
            </div>
          </label>
          <label className="flex-1 sm:flex-none">
            <input
              type="radio"
              name={`status-${item.id}`}
              value="no"
              checked={item.status === 'no'}
              onChange={() => handleStatusChange('no')}
              className="sr-only"
            />
            <div className={`flex items-center justify-center px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              item.status === 'no'
                ? 'bg-red-100 text-red-700 border-2 border-red-500'
                : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
            }`}>
              <span className="text-sm">No</span>
            </div>
          </label>
        </div>
      </div>
      
      {item.status === 'no' && (
        <div className="space-y-2 pl-2 border-l-2 border-red-200">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`fixed-${item.id}`}
              checked={fixed}
              onCheckedChange={handleFixedChange}
            />
            <label
              htmlFor={`fixed-${item.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Issue Fixed
            </label>
          </div>
          <Textarea
            placeholder="Add notes about the issue..."
            value={notes}
            onChange={handleNotesChange}
            className="min-h-[60px]"
          />
        </div>
      )}
    </div>
  );
};

export default InspectionItem;