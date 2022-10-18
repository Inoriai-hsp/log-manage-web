<template>
  <div class="app-container">
    <el-card class="form-container" shadow="never">
      <el-form label-width="150px">
        <el-form-item label="源文件：">
          <el-select placeholder="请选择文件">
          </el-select>
        </el-form-item>
        <el-form-item label="目标文件：">
          <el-select placeholder="请选择文件">
          </el-select>
        </el-form-item>
        <el-form-item label="源对象：">
          <el-select placeholder="请选择数据对象">
          </el-select>
        </el-form-item>
        <el-form-item label="目标对象：">
          <el-select placeholder="请选择数据对象">
          </el-select>
        </el-form-item>
        <el-form-item label="共指操作：">
          <el-select style="width: 100px"></el-select> - <el-select style="width: 100px"></el-select>
          <el-button circle icon="el-icon-plus" @click="addOperation"></el-button>
        </el-form-item>
        <el-form-item v-for="operation in operationList"
            :key="operation.key">
            <el-select style="width: 100px"></el-select> - <el-select style="width: 100px"></el-select>
            <el-button circle icon="el-icon-minus" @click.prevent="removeDomain(operation)" type="danger"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('logForm')">共指分析</el-button>
          <el-button v-if="!isEdit" @click="resetForm('logForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
    name: "pointAnalysis",
    data() {
      return {
        operationList: [],
      }
    },
    methods: {
      removeDomain(item) {
          var index = this.operationList.indexOf(item)
          if (index !== -1) {
              this.operationList.splice(index, 1)
          }
      },
      addOperation() {
          this.operationList.push({
              value: ''
          });
      },
    }
}
</script>

<style>

</style>