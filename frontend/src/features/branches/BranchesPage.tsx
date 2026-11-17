import React, { useState } from 'react';
import './BranchesPage.css';
import { useBranches } from '@/hooks/useBranches';
import { Branch } from '@/types/branch.types';
import { BranchStatCards } from './components/BranchStatCards';
import { BranchListTable } from './components/BranchListTable';
import { BranchFormModal } from './components/BranchFormModal';
import { BranchDetailModal } from './components/BranchDetailModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { Toast, ToastType } from '@/components/feedback/Toast';
import { Plus, Search, RefreshCw, Building } from 'lucide-react';

export const BranchesPage: React.FC = () => {
  const {
    branches,
    stats,
    loading,
    keyword,
    setKeyword,
    statusFilter,
    setStatusFilter,
    refresh,
    createBranch,
    updateBranch,
    deleteBranch,
  } = useBranches();

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [detailBranch, setDetailBranch] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Branch | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  const handleCreateOrUpdate = async (dto: any) => {
    if (selectedBranch) {
      await updateBranch(selectedBranch.id, dto);
      showToast('success', `Đã cập nhật chi nhánh ${dto.name} thành công!`);
    } else {
      await createBranch(dto);
      showToast('success', `Đã tạo chi nhánh mới ${dto.name} thành công!`);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteBranch(deleteTarget.id);
    showToast('success', `Đã xóa chi nhánh ${deleteTarget.name} thành công!`);
    setDeleteTarget(null);
  };

  return (
    <div className="branches-page-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Chi Nhánh & Trụ Sở</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Module Tổ chức HRM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị mạng lưới các văn phòng, trung tâm R&D và chi nhánh địa phương toàn quốc.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Làm mới
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedBranch(null);
              setIsFormOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Thêm chi nhánh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <BranchStatCards stats={stats} />

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Tìm theo tên chi nhánh, mã hoặc thành phố..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="w-full sm:w-52">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              { value: 'ACTIVE', label: 'Đang hoạt động' },
              { value: 'INACTIVE', label: 'Tạm dừng' },
              { value: 'MAINTENANCE', label: 'Bảo trì' },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <BranchListTable
        branches={branches}
        isLoading={loading}
        onView={(b) => setDetailBranch(b)}
        onEdit={(b) => {
          setSelectedBranch(b);
          setIsFormOpen(true);
        }}
        onDelete={(b) => setDeleteTarget(b)}
      />

      {/* Modals */}
      <BranchFormModal
        isOpen={isFormOpen}
        branchToEdit={selectedBranch}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
      />

      <BranchDetailModal
        branch={detailBranch}
        onClose={() => setDetailBranch(null)}
        onEdit={(b) => {
          setSelectedBranch(b);
          setIsFormOpen(true);
        }}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Xóa chi nhánh?"
        message={`Bạn có chắc chắn muốn xóa chi nhánh "${deleteTarget?.name}"? Dữ liệu lịch sử sẽ được bảo lưu.`}
        confirmText="Xóa chi nhánh"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default BranchesPage;
