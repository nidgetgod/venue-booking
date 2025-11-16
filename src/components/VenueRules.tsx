import React from 'react';

const VenueRules: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
      <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
        📋 場地使用規則
      </h4>
      <div className="text-sm text-orange-700 space-y-1">
        <p>• 務必穿著室內羽球鞋</p>
        <p>• 地板污漬請順手清理再離場</p>
        <p>• 除水和運動飲料，禁止攜帶食物飲料進入場館</p>
        <p>• 垃圾請帶離場館，請勿將垃圾投放在廁所</p>
        <p>• 提醒年幼孩童注意安全</p>
      </div>
    </div>
  );
};

export default VenueRules;
