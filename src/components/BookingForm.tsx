import React from 'react';

interface BookingFormProps {
  bookingForm: {
    name: string;
    phone: string;
    peopleCount: string;
  };
  lastBookingInfo: {
    name: string;
    phone: string;
    peopleCount: string;
  };
  setBookingForm: (form: any) => void;
  setLastBookingInfo: (info: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ bookingForm, lastBookingInfo, setBookingForm, setLastBookingInfo }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          姓名
          {lastBookingInfo.name && (
            <span className="text-xs text-green-600 ml-2">✓ 自動帶入上次資料</span>
          )}
        </label>
        <input
          type="text"
          value={bookingForm.name}
          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="請輸入姓名"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          電話
          {lastBookingInfo.phone && (
            <span className="text-xs text-green-600 ml-2">✓ 自動帶入上次資料</span>
          )}
        </label>
        <input
          type="tel"
          value={bookingForm.phone}
          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="請輸入電話號碼"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          人數
          {lastBookingInfo.peopleCount && (
            <span className="text-xs text-green-600 ml-2">✓ 自動帶入上次資料</span>
          )}
        </label>
        <input
          type="number"
          min="1"
          value={bookingForm.peopleCount}
          onChange={(e) => setBookingForm({ ...bookingForm, peopleCount: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="請輸入使用人數"
        />
      </div>
      {(lastBookingInfo.name || lastBookingInfo.phone || lastBookingInfo.peopleCount) && (
        <button
          type="button"
          onClick={() => {
            setBookingForm({ name: '', phone: '', peopleCount: '' });
            setLastBookingInfo({ name: '', phone: '', peopleCount: '' });
          }}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          清除自動填入資料
        </button>
      )}
    </div>
  );
};

export default BookingForm;
