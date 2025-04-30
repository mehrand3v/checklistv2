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
    <div className="group relative flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 dark:bg-gray-900/50 dark:border-gray-800 dark:hover:bg-gray-900/70">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-gray-900 dark:text-gray-100 leading-snug">{item.description}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto self-end sm:self-center">
          <label className="flex-1 sm:flex-none min-w-[60px] sm:min-w-[70px]">
            <input
              type="radio"
              name={`status-${item.id}`}
              value="yes"
              checked={item.status === 'yes'}
              onChange={() => handleStatusChange('yes')}
              className="sr-only"
            />
            <div className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-all duration-200 transform hover:scale-102 ${
              item.status === 'yes'
                ? 'bg-green-100 text-green-700 border-2 border-green-500 shadow-[0_0_0_1px_rgba(34,197,94,0.2)] dark:shadow-[0_0_0_1px_rgba(34,197,94,0.4)]'
                : 'bg-green-50/90 text-green-600 border border-green-200 hover:bg-green-100 hover:border-green-300 hover:shadow-[0_2px_4px_rgba(34,197,94,0.1)] dark:bg-green-950/10 dark:border-green-800/30 dark:hover:bg-green-900/20 dark:text-green-400'
            }`}>
              <span className="text-sm font-medium">Yes</span>
            </div>
          </label>
          <label className="flex-1 sm:flex-none min-w-[60px] sm:min-w-[70px]">
            <input
              type="radio"
              name={`status-${item.id}`}
              value="no"
              checked={item.status === 'no'}
              onChange={() => handleStatusChange('no')}
              className="sr-only"
            />
            <div className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-all duration-200 transform hover:scale-102 ${
              item.status === 'no'
                ? 'bg-red-100 text-red-700 border-2 border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)] dark:shadow-[0_0_0_1px_rgba(239,68,68,0.4)]'
                : 'bg-red-50/90 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 hover:shadow-[0_2px_4px_rgba(239,68,68,0.1)] dark:bg-red-950/10 dark:border-red-800/30 dark:hover:bg-red-900/20 dark:text-red-400'
            }`}>
              <span className="text-sm font-medium">No</span>
            </div>
          </label>
          <label className="flex-1 sm:flex-none min-w-[60px] sm:min-w-[70px]">
            <input
              type="radio"
              name={`status-${item.id}`}
              value="na"
              checked={item.status === 'na'}
              onChange={() => handleStatusChange('na')}
              className="sr-only"
            />
            <div className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-all duration-200 transform hover:scale-102 ${
              item.status === 'na'
                ? 'bg-gray-600 text-white border-2 border-gray-500 shadow-[0_0_0_1px_rgba(75,85,99,0.2)] dark:shadow-[0_0_0_1px_rgba(75,85,99,0.4)]'
                : 'bg-gray-100/90 text-gray-600 border border-gray-300 hover:bg-gray-200 hover:border-gray-400 hover:shadow-[0_2px_4px_rgba(75,85,99,0.1)] dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-300'
            }`}>
              <span className="text-sm font-medium">NA</span>
            </div>
          </label>
        </div>
      </div>
      
      {item.status === 'no' && (
        <div className="space-y-3 pl-3 border-l-2 border-red-200 dark:border-red-800/50 mt-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`fixed-${item.id}`}
              checked={fixed}
              onCheckedChange={handleFixedChange}
              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            <label
              htmlFor={`fixed-${item.id}`}
              className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300 select-none cursor-pointer"
            >
              Issue Fixed
            </label>
          </div>
          <Textarea
            placeholder="Add notes about the issue..."
            value={notes}
            onChange={handleNotesChange}
            className="min-h-[80px] resize-none bg-white/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 transition-colors duration-200"
          />
        </div>
      )}
      
      {/* Status indicator dot */}
      <div className={`absolute top-0 right-0 w-2 h-2 rounded-full transform translate-x-1/2 -translate-y-1/2 ${
        item.status === 'yes' 
          ? 'bg-green-500' 
          : item.status === 'no' 
            ? fixed 
              ? 'bg-yellow-500' 
              : 'bg-red-500'
            : item.status === 'na'
              ? 'bg-gray-500'
              : 'bg-gray-300'
      }`} />
    </div>
  );
};

export default InspectionItem;