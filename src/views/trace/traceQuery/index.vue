<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          开始溯源
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="用户名：">
            <el-input v-model="listQuery.username" class="input-width" placeholder="用户名"></el-input>
          </el-form-item>
          <!-- <el-form-item label="数字摘要：">
            <el-input v-model="listQuery.fileHash" class="input-width" placeholder="数字摘要"></el-input>
          </el-form-item> -->
          <el-form-item label="数据对象：">
            <el-input v-model="listQuery.dataObj" class="input-width" placeholder="数据对象"></el-input>
          </el-form-item>
          <el-form-item label="日志来源：">
            <el-select v-model="listQuery.type" placeholder="请选择类型">
              <el-option v-for="item in sourceList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker class="input-width" v-model="listQuery.start" value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime" placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker class="input-width" v-model="listQuery.end" value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime" placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- <el-dialog title="可视化" :visible.sync="visualVisible" @open="open()">
      <el-card shadow="never" style="margin-top: 20px">
        <div>
          <div ref="graph" style="width:100%;height:600px;"></div>
        </div>
      </el-card>
    </el-dialog> -->

    <!-- <div class="table-container">
      <el-table ref="opLogTable"
                :data="list"
                max-height="600"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="用户" align="center">
          <template slot-scope="scope">{{scope.row.createUser}}</template>
        </el-table-column>
        <el-table-column label="操作类型" align="center" :formatter="opTypeFormat">
        </el-table-column>
        <el-table-column label="操作日志" align="center">
          <template slot-scope="scope">{{scope.row.targetHash}}</template>
        </el-table-column>
        <el-table-column label="日志类型" align="center" :formatter="logTypeFormat">
        </el-table-column>
        <el-table-column label="操作时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDetail(scope.$index, scope.row)" size="small">数据锚定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div> -->
    <div class="table-container">
      <el-table ref="opLogTable" :data="list" max-height="600" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="数字摘要" align="center">
          <template slot-scope="scope">{{scope.row.fileHash}}</template>
        </el-table-column>
        <el-table-column label="日志来源" align="center" :formatter="logTypeFormat">
          <!-- <template slot-scope="scope">{{scope.row.logType}}</template> -->
        </el-table-column>
        <el-table-column label="日志类型" align="center" :formatter="typeFormat">
          <!-- <template slot-scope="scope">{{scope.row.type}}</template> -->
        </el-table-column>
        <el-table-column label="文件路径" align="center">
          <template slot-scope="scope">{{scope.row.filePath}}</template>
        </el-table-column>
        <el-table-column label="上传时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="primary" @click="handleDetail(scope.$index, scope.row)" size="small">数据锚定</el-button> -->
            <el-button type="primary" @click="handleTrace(scope.$index, scope.row)" size="small">溯源详情</el-button>
            <!-- <el-button type="primary" @click="handleVisual(scope.$index, scope.row)" size="small">可视化</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.current"
        :page-size="listQuery.size" :page-sizes="[10,15,20]" :total="total">
      </el-pagination>
    </div>
    <div style="clear: both; padding-bottom: 50px"></div>
    <!-- <el-dialog title="数据锚定" :visible.sync="dialogVisible" width="40%">
      <el-card>
        <div style="margin-top: 10px">文件ID：{{logDetail.id}}</div>
        <div style="margin-top: 10px">发送方IP：{{logDetail.srcIp}}</div>
        <div style="margin-top: 10px">上传时间：{{logDetail.uploadTime}}</div>
        <div style="margin-top: 10px">数字摘要：{{logDetail.hashcode}}</div>
        <div style="margin-top: 10px">文件路径：{{logDetail.filePath}}</div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadFile" size="small">下 载</el-button>
      </span>
    </el-dialog> -->
    <el-dialog title="行为记录溯源" :visible.sync="traceVisible">
      <div>数字摘要：{{logHash}}</div>
      <div class="table-container">
        <el-table ref="opLogTable" :data="traceList" max-height="400" style="width: 100%;" v-loading="traceListLoading"
          border>
          <el-table-column label="操作用户" align="center">
            <template slot-scope="scope">{{scope.row.dataUserName}}</template>
          </el-table-column>
          <el-table-column label="数据对象" align="center">
            <template slot-scope="scope">{{scope.row.dataObject}}</template>
          </el-table-column>
          <el-table-column label="操作行为" align="center">
            <template slot-scope="scope">{{scope.row.verbs}}</template>
          </el-table-column>
          <el-table-column label="日志内容" align="center">
            <template slot-scope="scope">{{scope.row.msg}}</template>
          </el-table-column>
          <el-table-column label="操作时间" align="center">
            <template slot-scope="scope">{{scope.row.time}}</template>
          </el-table-column>
          <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleDetail(scope.$index, scope.row)" size="small">数据锚定</el-button>
              <el-button type="primary" @click="handlePoint(scope.$index, scope.row)" size="small">共指分析</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <!-- <div class="pagination-container">
        <el-pagination background layout="total, sizes,prev, pager, next,jumper" :page-sizes="[10]" :total="total">
        </el-pagination>
      </div> -->
      <div style="clear: both;"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="traceVisible = false;" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="共指分析" :visible.sync="pointVisible">
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
            <el-form-item label="日志来源：">
              <el-select v-model="listQuery.opLogType" placeholder="请选择类型">
                <el-option v-for="item in sourceList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
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
      <div class="table-container">
        <el-table ref="opLogTable" :data="list" max-height="400" style="width: 100%;" v-loading="listLoading" border>
          <el-table-column label="用户" align="center">
            <template slot-scope="scope">{{scope.row.createUser}}</template>
          </el-table-column>
          <el-table-column label="操作行为" align="center">
            <template slot-scope="scope">{{scope.row.createUser}}</template>
          </el-table-column>
          <el-table-column label="操作对象" align="center">
            <template slot-scope="scope">{{scope.row.createUser}}</template>
          </el-table-column>
          <el-table-column label="操作时间" align="center">
            <template slot-scope="scope">{{scope.row.createTime}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleDetail(scope.$index, scope.row)" size="small">数据锚定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.current"
          :page-size="listQuery.size" :page-sizes="[10,15,20]" :total="total">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pointVisible = false;" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getChainDataPage, getDetailByTask } from '@/api/trace'
import ElTableInfiniteScroll from "el-table-infinite-scroll"

const defaultListQuery = {
  current: 1,
  size: 10,
  username: null,
  type: null,
  start: null,
  end: null,
  dataObj: null
};
const defaultLogDetail = {
  "id": '',
  "srcIp": '',
  "hashcode": '',
  "uploadTime": '',
  "filePath": '',
  "internetPath": ''
};
export default {
  name: 'traceQuery',
  directives: {
    "el-table-infinite-scroll": ElTableInfiniteScroll,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      traceList: null,
      logHash: null,
      total: null,
      logDetail: Object.assign({}, defaultLogDetail),
      listLoading: false,
      traceListLoading: false,
      dialogVisible: false,
      pointVisible: false,
      traceVisible: false,
      visualVisible: false,
      typeList: [
        {
          id: 1,
          name: "上传日志"
        },
        {
          id: 2,
          name: "查看详情"
        }
      ],
      sourceList: [
        {
          id: 1,
          name: "syslog"
        },
        {
          id: 2,
          name: "kafka"
        },
        {
          id: 3,
          name: "hadoop"
        }
      ],
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
  mounted() {
    this.getGraph()
  },
  methods: {
    getGraph() {
      const graph = this.$refs.graph
      if (graph) {
        const myGraph = this.$echarts.init(graph)
        console.log(myGraph);
        const option = {
          // title: {
          //   text: 'Graph'
          // },
          tooltip: {},
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'graph',
              layout: 'circular',
              symbolSize: 50,
              roam: true,
              label: {
                show: true
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                fontSize: 20
              },
              data: [
                {
                  name: 'Node 1',
                },
                {
                  name: 'Node 2',
                },
                {
                  name: 'Node 3',
                },
                {
                  name: 'Node 4',
                }
              ],
              links: [
                {
                  source: 'Node 1',
                  target: 'Node 2'
                },
                {
                  source: 'Node 1',
                  target: 'Node 3'
                },
                {
                  source: 'Node 1',
                  target: 'Node 4'
                },
              ],
              lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0
              }
            }
          ]
        }
        myGraph.setOption(option)
      }
    },
    open() {
      this.$nextTick(() => {
        this.getGraph();
      })
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
      if (row.logType === 5) {
        return 'syslog'
      }
      if (row.logType === 6) {
        return 'kafka'
      }
      if (row.logType === 7) {
        return 'hadoop'
      }
    },
    // load() {
    //   if (this.disabled) return;
    //   this.shardQuery.shardIndex++;
    //   getFileContentShard(this.shardQuery).then(res => {
    //     if(res.data === null) {
    //       this.disabled = true;
    //     } else {
    //       this.shardContent[0].content += res.data
    //     }
    //   })
    //   console.log(this.shardQuery.shardIndex)
    // },
    handleDetail(index, row) {
      // console.log(index, )
      // getFileInfo(row.targetId).then(res => {
      //   console.log(res);
      //   this.logDetail = res.data;
      //   this.shardQuery.fileId = row.targetId;
      //   this.shardQuery.shardIndex = 0;
      //   // getFileContentShard(this.shardQuery).then(res => {
      //   //   console.log(res.data);
      //   //   this.shardContent[0].content = res.data
      //   //   console.log(this.shardContent)
      //   // })
      //   this.dialogVisible = true;
      //   this.disabled = false;
      // })
      this.dialogVisible = true;
    },
    handlePoint(index, row) {
      console.log("point");
      this.pointVisible = true;
      console.log(this.pointVisible);
    },
    handleTrace(index, row) {
      this.traceVisible = true;
      this.traceListLoading = true;
      this.listQuery.taskId = row.taskId;
      getDetailByTask(this.listQuery).then(res => {
        this.traceListLoading = false;
        console.log(res.data);
        this.traceList = res.data.records;
        this.logHash = this.traceList[0].logHash;
      })
    },
    handleVisual(index, row) {
      this.visualVisible = true;
    },
    downloadFile() {
      window.open(this.logDetail.internetPath)
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      console.log(this.listQuery)
      this.listQuery.current = 1;
      this.getList();
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
    getList() {
      this.listLoading = true;
      getChainDataPage(this.listQuery).then(res => {
        console.log(res.data);
        this.listLoading = false;
        this.list = res.data.records;
        this.total = parseInt(res.data.total);
      })
    },
  }
}
</script>
<style>

</style>
