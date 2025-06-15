'use client';

import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import Modal from './Modal';
import { useLanguage } from '@/context/LanguageContext';

interface ReservationModalsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  type: 'create' | 'cancel' | 'admin-cancel';
  sessionTitle?: string;
  isLoading?: boolean;
}

const ReservationModals: React.FC<ReservationModalsProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  sessionTitle = '',
  isLoading = false,
}) => {
  const { t } = useLanguage();

  const getModalContent = () => {
    switch (type) {
      case 'create':
        return (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              {t('reservations.confirmCreate')}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => onConfirm()}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? t('common.loading') : t('common.confirm')}
              </button>
            </div>
          </div>
        );

      case 'cancel':
        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <p className="text-gray-600 dark:text-gray-300">
                {t('reservations.confirmCancel')}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => onConfirm()}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? t('common.loading') : t('common.confirm')}
              </button>
            </div>
          </div>
        );

      case 'admin-cancel':
        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-gray-600 dark:text-gray-300">
                {t('reservations.adminConfirmCancel', { title: sessionTitle })}
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => onConfirm()}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? t('common.loading') : t('common.confirm')}
              </button>
            </div>
          </div>
        );
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'create':
        return t('reservations.createTitle');
      case 'cancel':
        return t('reservations.cancelTitle');
      case 'admin-cancel':
        return t('reservations.adminCancelTitle');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="md"
    >
      {getModalContent()}
    </Modal>
  );
};

export default ReservationModals; 