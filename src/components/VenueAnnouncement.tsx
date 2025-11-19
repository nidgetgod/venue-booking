'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const VenueAnnouncement: React.FC = () => {
  const t = useTranslations('announcement');

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
        📢 {t('title')}
      </h4>
      <div className="text-sm text-blue-700 whitespace-pre-line">
        {t('content')}
      </div>
    </div>
  );
};

export default VenueAnnouncement;
