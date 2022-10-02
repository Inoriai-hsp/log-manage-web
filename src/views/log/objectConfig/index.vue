<template> 
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>对象列表</span>
            <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="userTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
                <el-table-column label="数据名" align="center">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">{{scope.row.operationList}}</template>
                </el-table-column>
                <el-table-column label="描述" align="center">
                    <template slot-scope="scope">{{scope.row.desc}}</template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleUpdate(scope.$index, scope.row)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background layout="total, sizes,prev, pager, next,jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-size="listQuery.size"
                :page-sizes="[10,15,20]" :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="isEdit?'编辑对象':'添加对象'" :visible.sync="dialogVisible" width="40%">
            <el-form :model="objectData" ref="objectForm" label-width="150px" size="small">
                <el-form-item label="数据名：">
                    <el-input v-model="objectData.name" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input v-model="objectData.desc" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item v-for="(operation, index) in objectData.operationList" :label="'操作' + index + '：'"
                    :key="operation.key" :prop="'operationList.' + index + '.value'">
                    <el-input v-model="operation.value" style="width: 250px"></el-input>
                    <el-button @click.prevent="removeDomain(operation)" type="danger">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('objectForm')">提交</el-button>
                    <el-button @click="addOperation">新增操作</el-button>
                    <el-button @click="resetForm('objectForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleSaveOrUpdate()" size="small">确 定</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>
<script>
import { getObjPageList, updateObj } from '@/api/dataObj'

const defaultListQuery = {
    current: 1,
    size: 10
};
const defaultObjectData = {
    name: null,
    operationList: [],
    desc: null
};
export default {
    name: 'objectList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            isEdit: false,
            listLoading: false,
            dialogVisible: false,
            objectData: Object.assign({}, defaultObjectData),
        }
    },
    created() {
        this.getList();
    },
    methods: {
        submitForm(formName) {
            this.objectData.operationList = this.getOptionsString(this.objectData.operationList)
            console.log(this.objectData)
            updateObj(this.objectData).then(res => {
                console.log(res.data);
                this.dialogVisible = false;
                this.getList();
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        removeDomain(item) {
            var index = this.objectData.operationList.indexOf(item)
            if (index !== -1) {
                this.objectData.operationList.splice(index, 1)
            }
        },
        addOperation() {
            this.objectData.operationList.push({
                value: ''
            });
        },
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
            this.objectData = {
                name: null,
                operationList: [],
                desc: null
            }
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.objectData = Object.assign({}, row);
            console.log(row);
        },
        handleSaveOrUpdate() {
            updateObj(this.objectData).then(res => {
                console.log(res.data);
                this.dialogVisible = false;
                this.getList();
            })
        },
        getList() {
              this.listLoading = true;
              getObjPageList(this.listQuery).then(res => {
                console.log(res.data);
                this.listLoading = false;
                this.list = res.data.records;
                this.total = parseInt(res.data.total);
              })
        },
        getOptionsString(operationList) {
            return operationList.map((item) => {
                return item.value;
            }).join(',')
        }
    }
}
</script>
<style>

</style>
  
  
  