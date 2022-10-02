<template>
  <div class="app-container">
    <el-card class="form-container" shadow="never">
      <el-form :model="logData"
              ref="logForm"
              label-width="150px">
        <el-form-item label="选择文件：">
          <el-upload
            ref="logFile"
            :limit="limit"
            drag
            action=""
            :http-request="handleFile">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <el-form-item label="日志类型：">
          <el-select v-model="logData.type"
                    placeholder="请选择类型">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否脱敏：">
          <el-radio-group v-model="logData.desensitization">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否隐藏：">
          <el-radio-group v-model="logData.hide">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否漂白：">
          <el-radio-group v-model="logData.bleach">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('logForm')">提交</el-button>
          <el-button v-if="!isEdit" @click="resetForm('logForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>处理中日志</span>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="数字摘要" align="center" prop="fileHash">
        </el-table-column>
        <el-table-column label="上传时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="日志类型" align="center" :formatter="typeFormat">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.size"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.current"
        :total="total">
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
  import { uploadFile, customize, findLogByStatus } from '@/api/log';
  
  const defaultLogData = {
    type: 1, //1 安全日志 2 流量日志 3 系统日志
    desensitization: false, //脱敏
    hide: false, // 隐藏
    bleach: false, // 漂白
    fileId: '', //文件ID
    logSourceType: 2, // 1 自动 2 手动
    securityLevel: 1, // 0 公开 1 保密
    pointAnalysis: false, // 共指
    userId: 0, // 用户ID
  }

  export default {
    name: "addLog",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        file: null,
        limit: 1,
        logData: Object.assign({}, defaultLogData),
        typeList: [
          {
            id: 1,
            name: "安全日志"
          },
          {
            id: 2,
            name: "流量日志"
          },
          {
            id: 3,
            name: "系统日志"
          }
        ],
        list: null,
        total: null,
        listLoading: false,
        listQuery: {
          current: 1,
          size: 5,
          status: 1
        },
        parentId: 0
      }
    },
    created() {
      this.logData = Object.assign({}, defaultLogData);
      // this.getList();
    },
    methods: {
      typeFormat(row, column) {
        if(row.type === 1) {
          return '安全日志'
        }
        if(row.type === 2) {
          return '流量日志'
        }
        if(row.type === 3) {
          return '系统日志'
        }
      },
      // getList() {
      //   this.listLoading = true;
      //   findLogByStatus(this.listQuery).then(res => {
      //     console.log(res);
      //     this.listLoading = false;
      //     this.list = res.data.records;
      //     this.total = parseInt(res.data.total);
      //   })
      // },
      // handleSizeChange(val) {
      //   this.listQuery.current = 1;
      //   this.listQuery.size = val;
      //   this.getList();
      // },
      // handleCurrentChange(val) {
      //   this.listQuery.current = val;
      //   this.getList();
      // },
      handleFile(params) {
        const formData = new FormData();
        formData.append('file', params.file);
        this.file = formData
      },
      onSubmit(formName) {
        this.$confirm('是否上传日志？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          uploadFile(this.file).then(res => {
            console.log(res.data);
            this.logData.fileId = res.data.id;
            customize(this.logData).then(res => {
              console.log(res);
              this.resetForm(formName);
              this.getList();
            })
          })
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$refs["logFile"].clearFiles();
        this.logData = Object.assign({}, defaultLogData);
        this.file = null;
      },
    }
  }
</script>

<style scoped>

</style>



