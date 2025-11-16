import React from 'react';

const VenuePricing: React.FC = () => {
  return (
    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
        💰 場地費用
      </h4>
      <div className="text-sm text-green-700 space-y-3">
        <div className="bg-white p-3 rounded-lg border border-green-200">
          <div className="font-medium text-green-800 mb-2">🌅 公益時段 (6:00-8:00)</div>
          <div className="flex justify-between items-center mb-1">
            <span>平日：</span>
            <span className="font-semibold">NT$ 50 / 場地 / 小時</span>
          </div>
          <div className="flex justify-between items-center">
            <span>假日：</span>
            <span className="font-semibold">NT$ 100 / 場地 / 小時</span>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-green-200">
          <div className="font-medium text-green-800 mb-2">🌞 平日日間 (8:00-18:00)</div>
          <div className="flex justify-between items-center">
            <span>費用：</span>
            <span className="font-semibold">NT$ 100 / 場地 / 小時</span>
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-green-200">
          <div className="font-medium text-green-800 mb-2">🌙 黃金時段</div>
          <div className="text-xs text-green-600 mb-2">平日18:00-21:00 及 假日全天</div>
          <div className="flex justify-between items-center">
            <span>費用：</span>
            <span className="font-semibold">NT$ 200 / 場地 / 小時</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-green-300 text-xs text-green-600">
          💡 所有費用以單個場地計算，請於現場付款
        </div>
      </div>
    </div>
  );
};

export default VenuePricing;
