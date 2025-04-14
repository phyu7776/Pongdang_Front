import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import Tippy from '@tippyjs/react';
import { getRoleConfig, getRoleDescription } from '../../utils/roleUtils';
import { showSuccessToast } from '../common/Toast';
import Modal from '../common/Modal';

const RoleDropdown = ({ value, onChange, roles, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedNewRole, setSelectedNewRole] = useState(null);
  const selectedRole = roles.find(role => role.value === value) || roles[0];
  const roleConfig = getRoleConfig(selectedRole.value);

  const handleRoleSelect = (role) => {
    if (role.value !== value) {
      setSelectedNewRole(role);
      setShowConfirmModal(true);
    }
    setIsOpen(false);
  };

  const TippyContent = () => (
    <div className="py-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg min-w-[200px]">
      {roles.map((role) => {
        const config = getRoleConfig(role.value);
        const Icon = config.icon;
        return (
          <button
            key={role.value}
            onClick={() => handleRoleSelect(role)}
            className={`w-full px-4 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700
              ${role.value === value ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}
            role="menuitem"
            aria-selected={role.value === value}
          >
            <div className="flex items-center space-x-2">
              <span className={`flex items-center justify-center ${config.color}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="font-medium">{role.label}</span>
            </div>
            {role.value === value && (
              <Check className="w-4 h-4 text-blue-500" />
            )}
          </button>
        );
      })}
    </div>
  );

  const Icon = roleConfig.icon;

  return (
    <>
      <div className="relative">
        <Tippy
          content={<TippyContent />}
          interactive={true}
          visible={isOpen}
          onClickOutside={() => setIsOpen(false)}
          placement="bottom-start"
          theme="material"
          animation="shift-away"
          arrow={false}
          maxWidth="none"
          appendTo={() => document.body}
        >
          <button
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'}
              ${roleConfig.bgColor}`}
            aria-haspopup="true"
            aria-expanded={isOpen}
            disabled={disabled}
          >
            <span className={`flex items-center ${roleConfig.color}`}>
              <Icon className="w-4 h-4" />
            </span>
            <span className="font-medium text-gray-900 dark:text-white">{selectedRole.label}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''} text-gray-500 dark:text-gray-400`} />
            <span className="sr-only">{getRoleDescription(selectedRole.value)}</span>
          </button>
        </Tippy>
        {isOpen && (
          <div className="fixed inset-0 z-10" aria-hidden="true" onClick={() => setIsOpen(false)} />
        )}
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="역할 변경 확인"
        actions={
          <>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => {
                onChange(selectedNewRole.value);
                setShowConfirmModal(false);
                showSuccessToast('역할이 변경되었습니다');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              확인
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-300">
          사용자의 역할을 <span className="font-medium text-blue-600 dark:text-blue-400">{selectedNewRole?.label}</span>(으)로 변경하시겠습니까?
        </p>
      </Modal>
    </>
  );
};

export default RoleDropdown; 