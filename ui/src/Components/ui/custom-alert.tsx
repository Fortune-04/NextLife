// components/CustomAlert.tsx
import React from 'react';

interface CustomAlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-5 w-80 text-center">
        <h2 className="text-base font-semibold text-black">{message}</h2>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gray-950 hover:bg-gray-600 text-white px-5 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
