<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="数字摘要：">
            <el-input v-model="listQuery.hashcode" class="input-width" placeholder="数字摘要"></el-input>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker class="input-width" v-model="listQuery.startTime" value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime" placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker class="input-width" v-model="listQuery.endTime" value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime" placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">日志文件列表</span>
      <el-button class="btn-add" @click="handleAddLog()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="logListTable" style="width: 100%" :data="list" v-loading="listLoading" border>
        <el-table-column label="数字摘要" align="center" prop="fileHash">
        </el-table-column>
        <el-table-column label="日志类型" align="center" :formatter="typeFormat">
        </el-table-column>
        <el-table-column label="日志来源" align="center" prop="logType">
        </el-table-column>
        <el-table-column label="是否脱敏" align="center">
          <template slot-scope="scope">{{scope.row.desensitization}}</template>
        </el-table-column>
        <el-table-column label="是否隐藏" align="center" prop="hide">
          <template slot-scope="scope">{{scope.row.hide}}</template>
        </el-table-column>
        <el-table-column label="是否漂白" align="center" prop="bleach">
          <template slot-scope="scope">{{scope.row.bleach}}</template>
        </el-table-column>
        <el-table-column label="上传时间" align="center">
          <template slot-scope="scope">{{scope.row.uploadTime}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="handleDetail(scope.$index, scope.row)">查看详情
            </el-button> -->
            <el-button size="mini" type="success" @click="handleChain(scope.$index, scope.row)">日志匹配
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :page-size="listQuery.size" :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.current" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getFileList, getLogInfo, getFileContentShard } from '@/api/log'
import ElTableInfiniteScroll from "el-table-infinite-scroll"

const defaultLogDetail = {
  "fileID": "",
  "logType": "",
  "fileHash": "", //文件哈希
  "sourceIP": "",
  "userID": "",
  "uploadTime": "",
  "isBleach": false, //是否漂白
  "isHide": false, //是否隐藏
  "isSensitive": false, //是否脱敏
  "groupID": "",
  "fileContent": [], //日志内容列表
}

export default {
  name: "logList",
  directives: {
    "el-table-infinite-scroll": ElTableInfiniteScroll,
  },
  data() {
    return {
      list: null,
      logDetail: Object.assign({}, defaultLogDetail),
      total: null,
      listLoading: true,
      dialogVisible: false,
      chainVisible: false,
      listQuery: {
        current: 1,
        size: 5,
        hashcode: null,
        startTime: null,
        endTime: null
      },
      shardQuery: {
        fileId: null,
        shardIndex: 0
      },
      shardContent: [{
        content: ''
      }],
      disabled: false
    }
  },
  created() {
    this.getList();
  },
  computed: {
    logType() {
      if (this.logDetail.logType === '5') {
        return 'syslog'
      }
      if (this.logDetail.logType === '6') {
        return 'kafka'
      }
      if (this.logDetail.logType === '7') {
        return 'hadoop'
      }
    }
  },
  mounted() {
    this.mockList = this.states.map(item => {
      return { value: item, label: item };
    });
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.mockList.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    typeFormat(row, column) {
      if (row.type === 1) {
        return '安全日志'
      }
      if (row.type === 2) {
        return '流量日志'
      }
      if (row.type === 3) {
        return '系统日志'
      }
    },
    logTypeFormat(row, column) {
      if (row.logType === 4) {
        return 'syslog'
      }
      if (row.type === 5) {
        return 'kafka'
      }
      if (row.type === 3) {
        return '系统日志'
      }
    },
    handleAddLog() {
      this.$router.push('/log/addLog');
    },
    getList() {
      this.listLoading = true;
      getFileList(this.listQuery).then(res => {
        console.log(res);
        this.listLoading = false;
        this.list = res.data.records;
        this.total = parseInt(res.data.total);
      })
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
    handleDetail(index, row) {
      console.log(index,)
      getLogInfo({ id: row.id }).then(res => {
        console.log(res);
        this.logDetail = res.data;
        this.shardQuery.fileId = res.data.fileId;
        this.shardQuery.shardIndex = 0;
        // getFileContentShard(this.shardQuery).then(res => {
        //   console.log(res.data);
        //   this.shardContent[0].content = res.data
        //   console.log(this.shardContent)
        // })
        this.dialogVisible = true;
        this.disabled = false;
      })
    },
    handleChain(index, row) {
      // console.log(row)
      this.$router.push({
        path: '/log/addChain',
        query: {
          fileId: row.id
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
