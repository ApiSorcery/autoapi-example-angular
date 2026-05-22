import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { User, UserQueryParams, SelectOption } from '@/app/models/user.model';
import { UserService } from '@/app/services/user.service';
import dayjs from '@/app/utils/dayjs.util';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    NzModalModule,
    NzSwitchModule,
    NzRadioModule,
    NzUploadModule,
    NzImageModule,
    NzTagModule,
    NzSpaceModule,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  // Query parameters
  queryParams: UserQueryParams = {
    code: '',
    name: '',
    status: undefined,
  };

  // Table data
  users: User[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // Modal
  isModalVisible = false;
  modalTitle = 'Create User';
  operateType: 'add' | 'edit' | 'view' = 'add';
  userForm: User = this.getEmptyUser();
  isSaving = false;

  // Upload
  uploadUrl = '/demo-api/file/upload';
  fileList: NzUploadFile[] = [];

  // Options
  genderOptions: SelectOption[] = [
    { value: 0, label: 'Unknown' },
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' },
  ];

  statusOptions: SelectOption[] = [
    { value: false, label: 'Disabled', color: 'gray' },
    { value: true, label: 'Enabled', color: '#1677ff' },
  ];

  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  getEmptyUser(): User {
    return {
      code: '',
      name: '',
      email: '',
      gender: undefined,
      avatar: '',
      address: '',
      status: false,
    };
  }

  async getList(): Promise<void> {
    this.loading = true;
    try {
      const res = await this.userService.getUserPaged({
        pagination: {
          page: this.pageIndex,
          limit: this.pageSize,
        },
        ...this.queryParams,
      });

      this.users = (res.results || []).map((r: any) => ({
        ...r,
        createdAt: dayjs(r.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs(r.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      }));
      this.total = res.total || 0;
    } catch (error) {
      console.error('Error loading users:', error);
      this.message.error('Failed to load users');
    } finally {
      this.loading = false;
    }
  }

  handleSearch(): void {
    this.pageIndex = 1;
    this.getList();
  }

  handleReset(): void {
    this.queryParams = {
      code: '',
      name: '',
      status: undefined,
    };
    this.handleSearch();
  }

  async handleExport(): Promise<void> {
    try {
      const messageId = this.message.loading('Exporting users...', { nzDuration: 0 }).messageId;
      const response = await this.userService.exportUsers({
        code: this.queryParams.code || '',
        name: this.queryParams.name || '',
        email: '',
      });

      // Create download link
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.name || `users_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.message.remove(messageId);
      this.message.success('Export completed successfully!');
    } catch (error) {
      console.error('Export error:', error);
      this.message.error('Export failed, please try again');
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getList();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.getList();
  }

  handleAdd(): void {
    this.operateType = 'add';
    this.modalTitle = 'Create User';
    this.userForm = this.getEmptyUser();
    this.fileList = [];
    this.isModalVisible = true;
  }

  handleView(user: User): void {
    this.operateType = 'view';
    this.modalTitle = 'View User';
    this.userForm = { ...user };
    this.fileList = user.avatar
      ? [
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: user.avatar,
          },
        ]
      : [];
    this.isModalVisible = true;
  }

  handleEdit(user: User): void {
    this.operateType = 'edit';
    this.modalTitle = 'Edit User';
    this.userForm = { ...user };
    this.fileList = user.avatar
      ? [
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: user.avatar,
          },
        ]
      : [];
    this.isModalVisible = true;
  }

  handleDelete(user: User): void {
    this.modal.confirm({
      nzTitle: 'Confirm',
      nzContent: 'This operation will permanently delete the data. Do you want to continue?',
      nzOkText: 'OK',
      nzCancelText: 'Cancel',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.userService.removeUser(user.id!);
          this.message.success('Deleted successfully!');
          this.getList();
        } catch (error) {
          console.error('Delete error:', error);
          this.message.error('Delete failed');
        }
      },
      nzOnCancel: () => {
        this.message.info('Delete cancelled');
      },
    });
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
    this.userForm = this.getEmptyUser();
    this.fileList = [];
  }

  async handleModalOk(): Promise<void> {
    if (this.operateType === 'view') {
      this.handleModalCancel();
      return;
    }

    // Simple validation
    if (!this.userForm.code || !this.userForm.name || !this.userForm.email) {
      this.message.error('Please fill in all required fields');
      return;
    }

    // Validate code for new users
    if (this.operateType === 'add') {
      try {
        const codeExists = await this.userService.validateCode(this.userForm.code);
        if (codeExists) {
          this.message.error('Code already exists');
          return;
        }
      } catch (error) {
        console.error('Code validation error:', error);
        this.message.error('Code validation failed, please try again');
        return;
      }
    }

    this.isSaving = true;
    try {
      if (this.userForm.id) {
        // 修改用户时，只发送 API 需要的字段，排除 createdAt 和 updatedAt
        const { createdAt, updatedAt, ...modifyData } = this.userForm;
        await this.userService.modifyUser(modifyData);
      } else {
        // 新增用户时，排除 id, createdAt 和 updatedAt
        const { id, createdAt, updatedAt, ...addData } = this.userForm;
        await this.userService.addUser(addData);
      }
      this.message.success('Saved successfully');
      this.isModalVisible = false;
      this.getList();
    } catch (error) {
      console.error('Save error:', error);
      this.message.error('Save failed');
    } finally {
      this.isSaving = false;
    }
  }

  handleUploadChange(info: { file: NzUploadFile }): void {
    if (info.file.status === 'uploading') {
      // 上传中，保持当前文件列表
      return;
    }

    if (info.file.status === 'done') {
      const response = info.file.response;
      if (response?.status === 0) {
        this.userForm.avatar = `/demo-api/file/${response.data}`;
        // 确保只保留一个文件
        this.fileList = [info.file];
        this.message.success('Upload successful');
      } else {
        this.message.error('Upload failed');
        // 上传失败，移除文件
        this.fileList = this.fileList.filter(f => f.uid !== info.file.uid);
      }
    } else if (info.file.status === 'error') {
      this.message.error('Upload failed');
      // 上传失败，移除文件
      this.fileList = this.fileList.filter(f => f.uid !== info.file.uid);
    } else if (info.file.status === 'removed') {
      // 文件被移除
      this.userForm.avatar = '';
      this.fileList = [];
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const size = Number((file.size! / 1024 / 1024).toFixed(2));
    if (size > 10) {
      this.message.warning('File size exceeds limit (10MB), please select again!');
      return false;
    }
    return true;
  };

  getGenderLabel(gender: number | undefined): string {
    if (gender === undefined) return 'Unknown';
    const option = this.genderOptions.find((o) => o.value === gender);
    return option?.label || 'Unknown';
  }

  getStatusLabel(status: boolean | undefined): string {
    if (status === undefined) return 'Unknown';
    const option = this.statusOptions.find((o) => o.value === status);
    return option?.label || 'Unknown';
  }

  getStatusColor(status: boolean | undefined): string {
    if (status === undefined) return 'default';
    const option = this.statusOptions.find((o) => o.value === status);
    return option?.color || 'default';
  }

  get isViewMode(): boolean {
    return this.operateType === 'view';
  }
}
