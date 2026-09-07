import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

// --- Styled Components ---

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const ToastContainerWrapper = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 9999;
  pointer-events: none;
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
  
  animation: ${slideIn} 0.3s ease-out forwards;

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

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
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
          <ToastBox key={t.id} $type={t.type}>
            <div className="toast-content">
              {getIcon(t.type)}
              <span className="message">{t.message}</span>
            </div>
            <button className="close-btn" onClick={() => removeToast(t.id)}>
              <FiX size={16} />
            </button>
          </ToastBox>
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
