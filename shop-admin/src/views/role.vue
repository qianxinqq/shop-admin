<template>
  <el-card class="box-card">
    <my-bread level1="权限管理"
              level2="角色列表"></my-bread>

    <el-row>
      <el-col :span="24">
        <el-button class="addbtn"
                   type="primary">主要按钮</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="rolelist"
              style="width: 100%">
      <!-- 展开列 type="expand" -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row class="level1"
                  v-for="(item1,index) in scope.row.children"
                  :key="index">
            <el-col :span="4">
              <el-tag @close="deleRole(scope.row,item1.id)"
                      closable
                      type="success">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>

            </el-col>
            <el-col :span="20">
              <el-row class="level2"
                      v-for="(item2,index) in item1.children"
                      :key="index">
                <el-col :span="4">
                  <el-tag @close="deleRole(scope.row,item2.id)"
                          closable
                          type="warning">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>

                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleRole(scope.row,item3.id)"
                          closable
                          type="error"
                          v-for="(item3,index) in item2.children"
                          :key="index">
                    {{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            未分配任何权限
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#"
                       type="index">
      </el-table-column>

      <el-table-column label="角色名称"
                       prop="roleName"
                       width="100">
      </el-table-column>
      <el-table-column label="角色描述"
                       prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     plain
                     circle></el-button>
          <el-button type="success"
                     icon="el-icon-check"
                     size="mini"
                     plain
                     circle
                     @click="showSetRightDia(scope.row)"></el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     plain
                     circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="dialogVisible"
               width="50%">
      <template slot-scope="scope">
        <!-- 树形结构 -->
        <el-tree ref="tree"
                 :data="treelist"
                 :props="defaultProps"
                 node-key='id'
                 :default-expanded-keys="expandedArr"
                 :default-checked-keys="checkedArr"
                 show-checkbox>
        </el-tree>

      </template>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="setRight()">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>
<script>
export default {
  data () {
    return {
      rolelist: []
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    async deleRole (role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      role.children = res.data.data
    },
    async loadTableData () {
      const res = await this.$http.get(`roles`)
      // console.log(res)
      this.rolelist = res.data.data
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}

.addbtn {
  margin-top: 20px;
}

.level1 {
  margin-bottom: 10px;
}

.level2 {
  margin-bottom: 10px;
}
</style>
