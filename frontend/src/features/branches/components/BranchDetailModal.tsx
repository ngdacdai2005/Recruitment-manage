import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Branch } from '../types/branch.types';
import { getBranchStatusLabel, getBranchStatusColor } from '../utils/branchHelpers';
import { Building, MapPin, Phone, Mail, User, Calendar, Users } from 'lucide-react';

export interface BranchDetailModalProps {
  branch: Branch | null;
  onClose: () => void;
  onEdit: (branch: Branch) => void;
}

export const BranchDetailModal: React.FC<BranchDetailModalProps> = ({
  branch,
  onClose,
  onEdit,
}) => {
  if (!branch) return null;

  const statusBadge = getBranchStatusColor(branch.status);

  return (
    <Modal
      isOpen={Boolean(branch)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>{branch.name}</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700">
            {branch.code}
          </span>
        </div>
      }
      description="Chi tiết cơ cấu tổ chức và thông tin liên hệ chi nhánh."
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 block text-[11px]">Trạng thái hoạt động</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold mt-1 border ${statusBadge.bg} ${statusBadge.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></span>
              {getBranchStatusLabel(branch.status)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Quy mô nhân sự</span>
            <span className="font-bold text-slate-800 text-sm mt-1 flex items-center gap-1">
              <Users className="w-4 h-4 text-indigo-600" />
              {branch.employeeCount} nhân viên
            </span>
          </div>

          <div className="col-span-2">
            <span className="text-slate-400 block text-[11px]">Địa chỉ trụ sở</span>
            <p className="font-medium text-slate-800 mt-1 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{branch.address}, {branch.city}</span>
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Người phụ trách / Giám đốc</span>
            <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              {branch.managerName}
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Ngày khai trương</span>
            <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {branch.openedDate}
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Số điện thoại</span>
            <p className="font-medium text-slate-800 mt-1 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400" />
              {branch.phone}
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Email liên hệ</span>
            <p className="font-medium text-slate-800 mt-1 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" />
              {branch.email}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(branch);
            }}
          >
            Chỉnh sửa chi nhánh
          </Button>
        </div>
      </div>
    </Modal>
  );
};
