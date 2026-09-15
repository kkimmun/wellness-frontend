import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

// --- Styled Components ---

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ToastContainerWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column-reverse; /* 새 알림이 아래쪽에 쌓이도록 */
  gap: 12px;
  z-index: 9999;
  pointer-events: none;

  @media (max-width: 768px) {
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    left: 16px;
    right: 16px;
    align-items: center;
  }
`;

const ToastBox = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 400px;
  background-color: #ffffff;
  padding: 16px;
  border-radius: ${theme.radius.md || '8px'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid ${(props) => {
    if (props.$type === 'success') return theme.colors.primary;
    if (props.$type === 'error') return theme.colors.error || '#ff4d4f';
    return theme.colors.textSecondary || '#666';
  }};
  
  animation: ${slideUp} 0.3s ease-out forwards;

  @media (max-width: 768px) {
    min-width: 0;
    width: 100%;
    max-width: 420px;
    padding: 12px 16px;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .icon {
    font-size: 20px;
    color: ${(props) => {
      if (props.$type === 'success') return theme.colors.primary;
      if (props.$type === 'error') return theme.colors.error || '#ff4d4f';
      return theme.colors.textSecondary || '#666';
    }};
  }

  .message {
    font-size: ${theme.fontSize.sm || '14px'};
    color: ${theme.colors.textPrimary || '#333'};
    font-weight: 500;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: ${theme.colors.textSecondary || '#666'};
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: ${theme.colors.textPrimary || '#333'};
    }
  }
`;

// Toast 개별 아이템 (자동 삭제 타이머 로직 내장)
const ToastItem = ({ toast, removeToast, getIcon }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer); // 언마운트 시 자동 정리 (메모리 누수 방지)
  }, [toast.id, removeToast]);

  return (
    <ToastBox $type={toast.type}>
      <div className="toast-content">
        {getIcon(toast.type)}
        <span className="message">{toast.message}</span>
      </div>
      <button className="close-btn" onClick={() => removeToast(toast.id)}>
        <FiX size={16} />
      </button>
    </ToastBox>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="icon" />;
      case 'error': return <FiAlertCircle className="icon" />;
      default: return <FiInfo className="icon" />;
    }
  };

  // 객체가 매 렌더링마다 재생성되는 것을 방지하여 무한 루프(useEffect) 차단
  const toast = useMemo(() => ({
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainerWrapper>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} removeToast={removeToast} getIcon={getIcon} />
        ))}
      </ToastContainerWrapper>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
