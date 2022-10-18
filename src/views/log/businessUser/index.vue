<template> 
    <div class="app-container">
      <el-card class="operate-container" shadow="never">
        <i class="el-icon-tickets"></i>
        <span>用户列表</span>
        <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
      </el-card>
      <div class="table-container">
        <el-table ref="userTable"
                  :data="list"
                  style="width: 100%;"
                  v-loading="listLoading" border>
          <el-table-column label="用户名" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="业务系统" align="center">
            <template slot-scope="scope">{{scope.row.username}}</template>
          </el-table-column>
          <el-table-column label="用户类型" align="center">
            <template slot-scope="scope">{{scope.row.username}}</template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="primary"
                         @click="handleUpdate(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button size="mini"
                         type="danger"
                         @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes,prev, pager, next,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.current"
          :page-size="listQuery.size"
          :page-sizes="[10,15,20]"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog
        :title="isEdit?'编辑用户':'添加用户'"
        :visible.sync="dialogVisible"
        width="40%">
        <el-form :model="userData"
                 ref="userForm"
                 label-width="150px" size="small">
          <el-form-item label="用户名：">
            <el-input v-model="userData.username" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="业务系统">
            <el-input v-model="userData.username" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="用户类型：">
            <el-select v-model="userData.userType"
                      placeholder="请选择类型">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="handleSaveOrUpdate()" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  <script>
    import { listPage, saveOrUpdate, delUser } from '@/api/user'
  
    const defaultListQuery = {
      current: 1,
      size: 10
    };
    const defaultUserData = {
      id: null,
      username: '',
      password: '',
      userType: 1
    };
    export default {
      name: 'userList',
      data() {
        return {
          listQuery: Object.assign({}, defaultListQuery),
          list: null,
          total: null,
          isEdit: false,
          listLoading: false,
          dialogVisible: false,
          userData: Object.assign({}, defaultUserData),
          typeList: [
            {
              id: 0,
              name: "管理员用户"
            },
            {
              id: 1,
              name: "普通用户"
            }
          ]
        }
      },
      created() {
        this.getList();
      },
      methods: {
        handleSizeChange(val) {
          this.listQuery.current = 1;
          this.listQuery.size = val;
          this.getList();
        },
        handleCurrentChange(val) {
          this.listQuery.current = val;
          this.getList();
        },
        handleAdd() {
          this.dialogVisible = true;
          this.isEdit = false;
          this.userData = Object.assign({}, defaultUserData);
        },
        handleDelete(index, row) {
          this.$confirm('是否要删除该用户?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delUser(row.id).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
            });
          });
        },
        handleUpdate(index, row) {
          this.dialogVisible = true;
          this.isEdit = true;
          this.userData = Object.assign({},row);
          console.log(row);
        },
        handleSaveOrUpdate() {
          saveOrUpdate(this.userData).then(res => {
            console.log(res.data);
            this.dialogVisible = false;
            this.getList();
          })
        },
        getList() {
          this.listLoading = true;
          listPage(this.listQuery).then(res => {
            console.log(res.data);
            this.listLoading = false;
            this.list = res.data.records;
            this.total = parseInt(res.data.total);
          })
        },
      }
    }
  </script>
  <style></style>
  
  
  