import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// OAuth Dialog Component
export const OAuthDialog = ({ isOpen, onClose, authUrl, message }) => {
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    const popup = window.open(authUrl, 'oauth_popup', 'width=600,height=600,scrollbars=yes,resizable=yes');

    // Lắng nghe khi popup đóng
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setIsAuthorizing(false);
        onClose(true);
      }
    }, 1000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(authUrl);
    toast.success('Link đã được copy vào clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{zIndex: 99999999999999}}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Cần xác thực Google Drive</h2>
          <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="bg-gray-50 p-3 rounded border mb-4">
            <p className="text-sm text-gray-700 break-all">{authUrl}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAuthorize}
            disabled={isAuthorizing}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isAuthorizing ? 'Đang xác thực...' : 'Xác thực ngay'}
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Copy Link
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">Sau khi xác thực xong, vui lòng đóng cửa sổ popup và thử lại.</p>
      </div>
    </div>
  );
};
