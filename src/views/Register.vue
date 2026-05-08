<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="text-center mb-4">Đăng ký tài khoản</h2>

      <form @submit.prevent="signUpWithEmail">
        <div class="form-group">
          <label for="displayName">Tên hiển thị</label>
          <input
            id="displayName"
            v-model="displayName"
            type="text"
            class="form-control"
            placeholder="Nhập tên hiển thị"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Nhập email của bạn"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-success btn-block mb-3"
          :disabled="loading"
        >
          <span v-if="!loading">Đăng ký</span>
          <span v-else>Đang xử lý...</span>
        </button>
      </form>

      <div class="text-center">
        <p class="mb-2">Đã có tài khoản?</p>
        <router-link to="/login" class="btn btn-outline-primary">
          Đăng nhập ngay
        </router-link>
      </div>

      <div v-if="error" class="alert alert-danger mt-3">
        <i class="fas fa-exclamation-triangle"></i>
        {{ error }}
      </div>

      <div v-if="success" class="alert alert-success mt-3">
        <i class="fas fa-check-circle"></i>
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service.js";

export default {
  name: "Register",
  data() {
    return {
      loading: false,
      error: null,
      success: null,
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async signUpWithEmail() {
      // Validation
      if (
        !this.displayName ||
        !this.email ||
        !this.password ||
        !this.confirmPassword
      ) {
        this.error = "Vui lòng điền đầy đủ thông tin";
        this.success = null;
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = "Mật khẩu xác nhận không khớp";
        this.success = null;
        return;
      }

      if (this.password.length < 6) {
        this.error = "Mật khẩu phải có ít nhất 6 ký tự";
        this.success = null;
        return;
      }

      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const result = await AuthService.signUpWithEmail(
          this.email,
          this.password,
          this.displayName,
        );
        if (result.success) {
          this.success = "Đăng ký thành công! Đang chuyển hướng...";
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        } else {
          this.error = result.error;
        }
      } catch (error) {
        this.error = "Có lỗi xảy ra khi đăng ký";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-card h2 {
  color: #333;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

.btn-outline-primary {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.alert {
  border-radius: 5px;
  border: none;
  padding: 12px 15px;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }
}
</style>
