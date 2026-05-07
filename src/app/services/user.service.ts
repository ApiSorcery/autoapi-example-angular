import { Injectable } from '@angular/core';
import * as apiUser from '@/apis/auto/demo/ApiUser';
import * as Model from '@/apis/auto/demo/model';
import { User, UserPagedParams } from '@/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  async getUserPaged(params: UserPagedParams) {
    return await apiUser.getUserPaged(params);
  }

  async addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    return await apiUser.addUser(user as Model.UserAddRequestDto);
  }

  async modifyUser(user: Omit<User, 'createdAt' | 'updatedAt'>) {
    if (!user.id) {
      throw new Error('User ID is required for modification');
    }
    return await apiUser.modifyUser(user as Model.UserModifyRequestDto);
  }

  async removeUser(id: number) {
    return await apiUser.removeUser({ id });
  }

  async validateCode(code: string) {
    return await apiUser.validateCode({ code });
  }

  async exportUsers(params: Model.ExportUsersRequest) {
    return await apiUser.exportUsers(params);
  }
}
