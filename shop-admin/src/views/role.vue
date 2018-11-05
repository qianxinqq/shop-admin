<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理"
              level2="角色列表"></my-bread>
    <!-- 按钮 -->
    <el-row>
      <el-col :span="24">
        <el-button class="addbtn"
                   type="button">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="rolelist"
              style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row class="level1"
                  v-for="(item1, index) in scope.row.children"
                  :key="index">
            <el-col :span="4">
              <el-tag @close="deleRole(scope.row, item1.id)"
                      closable
                      type="success">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2"
                      v-for="(item2, index) in item1.children"
                      :key="index">
                <el-col :span="4">
                  <el-tag @close="deleRole(scope.row, item2.id)"
                          closable
                          type="warning">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag @close="deleRole(scope.row, item3.id)"
                          closable
                          type="error"
                          v-for="(item3, index) in item2.children"
                          :key="index">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">未分配任何权限</el-row>
        </template>
      </el-table-column>
      <el-table-column label="#"
                       type="index">
      </el-table-column>
      <el-table-column label="角色名称"
                       prop="roleName">
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
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     plain
                     circle></el-button>
          <el-button type="success"
                     icon="el-icon-check"
                     size="mini"
                     plain
                     circle
                     @click="showSetRightDia(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="dialogVisible"
               width="50%">
      <template slot-scope="scope">
        <!-- 树形结构 -->
        <el-tree ref="tree"
                 show-checkbox
                 :data="treelist"
                 :props="defaultProps"
                 node-key='id'
                 :default-expanded-keys="expandedArr"
                 :default-checked-keys="checkedArr">
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
      rolelist: [],
      dialogVisible: false,
      treelist: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    async setRight () {
      this.dialogVisible = false
      const arr1 = this.$refs.tree.getCheckedKeys()
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: arr.join(',')
      })
      const { meta: { status, msg } } = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.loadTableData()
      }
    },
    async showSetRightDia (role) {
      this.roleId = role.id
      this.dialogVisible = true
      const res = await this.$http.get('rights/tree')
      // console.log(res)
      this.treelist = res.data.data
      const arr = []
      res.data.data.forEach(item1 => {
        arr.push(item1.id)
        item1.children.forEach(item2 => {
          arr.push(item2.id)
          item2.children.forEach(item3 => {
            arr.push(item3.id)
          })
        })
      })
      this.expandedArr = arr
      const arrcheck = []
      role.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arrcheck.push(item3.id)
          })
        })
      })
      this.checkedArr = arrcheck
    },
    async deleRole (role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      // console.log(res)
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
