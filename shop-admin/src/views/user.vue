<template>
  <el-card class="box-card">

    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input placeholder="请输入内容"
                  class="searchInput"
                  v-model="searchVal">
          <el-button slot="append"
                     icon="el-icon-search"
                     @click="checkUser()"></el-button>
        </el-input>
        <el-button type="success"
                   @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>
    <el-dialog title="添加用户"
               :visible.sync="dialogFormVisibleAdduser">
      <el-form label-width="formLabelWidth"
               :model="formData">
        <el-form-item label="用户名">
          <el-input v-model="formData.username"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formData.password"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.mobile"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisibleAdduser = false">取 消</el-button>
        <el-button type="primary"
                   @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table style="width: 100%"
              v-loading="loading"
              :data="list">
      <el-table-column type="index"
                       label="#"
                       width="100">
      </el-table-column>

      <el-table-column prop="username"
                       label="姓名"
                       width="100">
      </el-table-column>

      <el-table-column prop="email"
                       label="邮箱"
                       width="180">
      </el-table-column>

      <el-table-column label="电话"
                       prop="mobile"
                       width="100">
      </el-table-column>

      <el-table-column label="创建日期"
                       width="180">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtDate}}
        </template>
      </el-table-column>

      <el-table-column prop="date"
                       label="用户状态"
                       width="120">
        <template slot-scope="scope">
          <!-- slot-scope="scope" 就是list 用来传值是固定用法-->
          <el-switch v-model="scope.row.mg_state"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     @change="changeSwitchMgstate(scope.row)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       width="160">
        <template slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     circle
                     size="mini"
                     plain>
          </el-button>
          <el-button type="success"
                     icon="el-icon-check"
                     circle
                     size="mini"
                     plain>
          </el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="mini"
                     plain
                     @click="showDeleBox(scope.row.id)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[2, 4, 6, 8]"
                   :page-size="pagesize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total">
    </el-pagination>
    <!-- 分页 -->

  </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      loading: false,
      pagenum: 1,
      currentPage: 1,
      pagesize: 2,
      total: 0,
      searchVal: '',
      dialogFormVisibleAdduser: false,
      formLabelWidth: '100px',
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.loadTableData()
  },
  methods: {
    async addUser () {
      this.dialogFormVisibleAdduser = false
      const res = await this.$http.post('users', this.formData)
      const { meta: { msg, status } } = res.data
      this.loadTableData()
      if (status === 200) {
        this.$message.success(msg)
      }
      // 清空表单
      this.formData = {}
    },
    // 添加
    showAddUserDia () {
      this.dialogFormVisibleAdduser = true
    },
    // 删除
    showDeleBox (userId) {
      this.$confirm('Sure?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`users/${userId}`)
        const { meta: { msg, status } } = res.data
        if (status === 200) {
          this.loadTableData()
          this.$message({
            type: 'success',
            message: msg
          })
        }
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: msg
          })
        })
    },
    // 修改用户状态
    async changeSwitchMgstate (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // const data = res.data
      console.log(res)
      if (status === 200) {
        const { meta: { status, msg } } = res.data
        if (status === 200) {
          this.$message.success(msg)
        } else {
          this.$message.error(msg)
        }
      }
    },
    // 查询用户发请求
    checkUser () {
      this.loadTableData()
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.loadTableData()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.loadTableData()
    },
    async loadTableData () {
      this.loading = true
      const AUTH_TOKEN = sessionStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
      // console.log(res)
      // 结构赋值拿到data数据
      // this.loading = false
      this.total = res.data.data.total
      const { meta: { msg, status }, data: { users } } = res.data
      console.log(msg)
      if (status === 200) {
        this.loading = false
        this.list = users
        this.pagenum = 1
        // this.pagesize = 2
        // this.currentpage = 1
        // console.log(this.list)
      }
    }
  }
}

</script>

<style>
.box-card {
  height: 100%;
}
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
