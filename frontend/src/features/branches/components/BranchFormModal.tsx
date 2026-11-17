import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Branch, CreateBranchDto } from '@/types/branch.types';

export interface BranchFormModalProps {
  isOpen: boolean;
  branchToEdit?: Branch | null;
  onClose: () => void;
  onSubmit: (data: CreateBranchDto) => Promise<void>;
}

export const BranchFormModal: React.FC<BranchFormModalProps> = ({
  isOpen,
  branchToEdit,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateBranchDto>({
    code: '',
    name: '',
    address: '',
    city: 'Hà Nội',
    phone: '',
    email: '',
    managerName: '',
    openedDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (branchToEdit) {
      setFormData({
        code: branchToEdit.code,
        name: branchToEdit.name,
        address: branchToEdit.address,
        city: branchToEdit.city,
        phone: branchToEdit.phone,
        email: branchToEdit.email,
        managerName: branchToEdit.managerName,
        openedDate: branchToEdit.openedDate,
        status: branchToEdit.status,
      });
    } else {
      setFormData({
        code: `BR-${Date.now().toString().slice(-4)}`,
        name: '',
        address: '',
        city: 'Hà Nội',
        phone: '',
        email: '',
        managerName: '',
        openedDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      });
    }
  }, [branchToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={branchToEdit ? `Chỉnh sửa: ${branchToEdit.name}` : 'Thêm mới Chi nhánh'}
      description="Điền thông tin định danh và liên hệ quản trị chi nhánh."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Mã chi nhánh (*)"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="BR-HN-01"
          />
          <Input
            label="Tên chi nhánh (*)"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Chi nhánh Cầu Giấy..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Tỉnh / Thành phố (*)"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Hà Nội, TP. HCM..."
          />
          <Input
            label="Địa chỉ chi tiết (*)"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Số nhà, phố, quận/huyện..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Số điện thoại liên hệ"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="024 3999 xxxx"
          />
          <Input
            label="Email chi nhánh"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="branch@recruitment.com"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Người phụ trách / Giám đốc"
            value={formData.managerName}
            onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
            placeholder="Nguyễn Văn A"
          />
          <Input
            label="Ngày thành lập"
            type="date"
            value={formData.openedDate}
            onChange={(e) => setFormData({ ...formData, openedDate: e.target.value })}
          />
          <Select
            label="Trạng thái"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'ACTIVE', label: 'Đang hoạt động' },
              { value: 'INACTIVE', label: 'Tạm dừng' },
              { value: 'MAINTENANCE', label: 'Bảo trì / Sửa chữa' },
            ]}
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            {branchToEdit ? 'Lưu thay đổi' : 'Tạo chi nhánh'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
