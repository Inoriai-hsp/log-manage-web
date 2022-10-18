<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          开始溯源
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="用户名：">
            <el-input
              v-model="listQuery.username"
              class="input-width"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="数字摘要：">
            <el-input v-model="listQuery.fileHash" class="input-width" placeholder="数字摘要"></el-input>
          </el-form-item> -->
          <el-form-item label="数据对象：">
            <el-input
              v-model="listQuery.dataObj"
              class="input-width"
              placeholder="数据对象"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务系统：">
            <el-select v-model="listQuery.type" placeholder="请选择类型">
              <el-option
                v-for="item in sourceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.start"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.end"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table
        ref="opLogTable"
        :data="list"
        max-height="600"
        style="width: 100%"
        v-loading="listLoading"
        border
      >
        <el-table-column label="数字摘要" align="center">
          <template slot-scope="scope">{{ scope.row.fileHash }}</template>
        </el-table-column>
        <!-- <el-table-column label="日志来源" align="center" :formatter="logTypeFormat"> -->
        <!-- <template slot-scope="scope">{{scope.row.logType}}</template> -->
        <!-- </el-table-column> -->
        <el-table-column
          label="日志类型"
          align="center"
          :formatter="typeFormat"
        >
          <!-- <template slot-scope="scope">{{scope.row.type}}</template> -->
        </el-table-column>
        <el-table-column label="文件路径" align="center">
          <template slot-scope="scope">{{ scope.row.filePath }}</template>
        </el-table-column>
        <el-table-column label="上传时间" align="center">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="链ID" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button type="primary" @click="handleDetail(scope.$index, scope.row)" size="small">数据锚定</el-button> -->
            <el-button
              type="primary"
              @click="handleTrace(scope.$index, scope.row)"
              size="small"
              >溯源详情</el-button
            >
            <el-button
              type="primary"
              @click="handleChart(scope.$index, scope.row)"
              size="small"
              >可视化</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.current"
        :page-size="listQuery.size"
        :page-sizes="[10, 15, 20]"
        :total="total"
      >
      </el-pagination>
    </div>
    <div style="clear: both; padding-bottom: 50px"></div>
    <el-dialog title="行为记录溯源" :visible.sync="traceVisible">
      <div>
        <el-tag>{{ logHash }}</el-tag>
      </div>
      <div class="table-container">
        <el-table
          ref="opLogTable"
          :data="traceList"
          max-height="400"
          style="width: 100%"
          v-loading="traceListLoading"
          border
        >
          <el-table-column label="操作用户" align="center">
            <template slot-scope="scope">{{ scope.row.dataUserName }}</template>
          </el-table-column>
          <el-table-column label="数据对象" align="center">
            <template slot-scope="scope">{{ scope.row.dataObject }}</template>
          </el-table-column>
          <el-table-column label="操作行为" align="center">
            <template slot-scope="scope">{{ scope.row.verbs }}</template> 
          </el-table-column>
          <el-table-column label="日志内容" align="center">
            <template slot-scope="scope">{{ scope.row.msg }}</template>
          </el-table-column>
          <el-table-column label="是否合法" align="center">
            <template slot-scope="scope">是/否</template>
          </el-table-column>
          <el-table-column label="操作时间" align="center">
            <template slot-scope="scope">{{ scope.row.time }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="traceSizeChange"
          @current-change="traceCurrentChange"
          layout="total, prev, pager, next,jumper"
          :page-sizes="[10]"
          :total="traceTotal"
        >
        </el-pagination>
      </div>
      <div style="clear: both"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="traceVisible = false" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="溯源可视化" :visible.sync="chartVisible">
      <div ref="graph" style="width: 100%; height: 400px"></div>
    </el-dialog>
    <div id="container"></div>
  </div>
</template>
<script>
import { getChainDataPage, getDetailByTask } from '@/api/trace'
import ElTableInfiniteScroll from "el-table-infinite-scroll"
import G6 from "@antv/g6"

const data = {
  "id": "Modeling Methods",
  "children": [
    {
      "id": "Classification",
      "children": [
        {
          "id": "Logistic regression"
        },
        {
          "id": "Linear discriminant analysis"
        },
        {
          "id": "Rules"
        },
        {
          "id": "Decision trees"
        },
        {
          "id": "Naive Bayes"
        },
        {
          "id": "K nearest neighbor"
        },
        {
          "id": "Probabilistic neural network"
        },
        {
          "id": "Support vector machine"
        }
      ]
    },
    {
      "id": "Consensus",
      "children": [
        {
          "id": "Models diversity",
          "children": [
            {
              "id": "Different initializations"
            },
            {
              "id": "Different parameter choices"
            },
            {
              "id": "Different architectures"
            },
            {
              "id": "Different modeling methods"
            },
            {
              "id": "Different training sets"
            },
            {
              "id": "Different feature sets"
            }
          ]
        },
        {
          "id": "Methods",
          "children": [
            {
              "id": "Classifier selection"
            },
            {
              "id": "Classifier fusion"
            }
          ]
        },
        {
          "id": "Common",
          "children": [
            {
              "id": "Bagging",
              "style": {
                "fill": "red",
                "stroke": "red"
              }
            },
            {
              "id": "Boosting"
            },
            {
              "id": "AdaBoost"
            }
          ]
        }
      ]
    },
    {
      "id": "Regression",
      "children": [
        {
          "id": "Multiple linear regression"
        },
        {
          "id": "Partial least squares"
        },
        {
          "id": "Multi-layer feedforward neural network"
        },
        {
          "id": "General regression neural network"
        },
        {
          "id": "Support vector regression"
        }
      ]
    }
  ]
};
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
      traceQuery: null,
      list: null,
      traceList: null,
      logHash: null,
      total: null,
      traceTotal: null,
      logDetail: Object.assign({}, defaultLogDetail),
      listLoading: false,
      traceListLoading: false,
      dialogVisible: false,
      chartVisible: false,
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
    this.getGraph();
  },
  methods: {
    getGraph() {
      const container = document.getElementById('container');
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.getModel();
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          size: 26,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        defaultEdge: {
          type: 'cubic-horizontal',
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth() {
            return 16;
          },
          getVGap: function getVGap() {
            return 10;
          },
          getHGap: function getHGap() {
            return 100;
          },
        },
      });

      graph.node(function (node) {
        return {
          label: node.id,
          labelCfg: {
            offset: 10,
            position: node.children && node.children.length > 0 ? 'left' : 'right',
          },
        };
      });

      graph.data(data);
      graph.render();
      graph.fitView();
    },
    handleChart() {
      this.chartVisible = true;
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
    handlePoint(index, row) {
      console.log("point");
      this.pointVisible = true;
      console.log(this.pointVisible);
    },
    traceSizeChange(val) {
      this.traceQuery.current = 1;
      this.traceQuery.size = val;
      this.getTraceList();
    },
    traceCurrentChange(val) {
      this.traceQuery.current = val;
      this.getTraceList();
    },
    handleTrace(index, row) {
      this.traceVisible = true;
      this.traceQuery = Object.assign({}, this.listQuery);
      this.traceQuery.taskId = row.taskId;
      this.traceQuery.current = 1;
      this.traceQuery.size = 10;
      console.log(this.traceQuery);
      this.getTraceList();
    },
    getTraceList() {
      this.traceListLoading = true;
      getDetailByTask(this.traceQuery).then(res => {
        this.traceListLoading = false;
        this.traceTotal = parseInt(res.data.total);
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
