<template>
  <div class="login-wrapper">
    <div class="login-glass-card">
      <div class="login-header">
        <div class="logo-circle">
          <i class="fas fa-user-shield"></i>
        </div>
        <h2>Chào mừng trở lại</h2>
        <p class="text-subtitle">Vui lòng đăng nhập để tiếp tục</p>
      </div>

      <!-- Form chính -->
      <form @submit.prevent="signInWithEmail" class="mt-4">
        <div class="input-group-custom">
          <i class="fas fa-envelope"></i>
          <input
            v-model="email"
            type="email"
            placeholder="Email của bạn"
            required
          />
        </div>

        <div class="input-group-custom mt-3">
          <i class="fas fa-lock"></i>
          <input
            v-model="password"
            type="password"
            placeholder="Mật khẩu"
            required
          />
        </div>

        <button type="submit" class="btn-primary-custom mt-4" :disabled="loading">
          <span v-if="!loading">Đăng nhập <i class="fas fa-arrow-right ml-2"></i></span>
          <div v-else class="spinner-border spinner-border-sm"></div>
        </button>
      </form>

      <div class="divider-text">hoặc dùng mạng xã hội</div>

      <!-- Social Buttons -->
      <div class="social-grid">
        <button class="btn-social google" @click="signInWithGoogle" :disabled="loading" type="button">
          <i class="fab fa-google"></i>
        </button>
        <button class="btn-social facebook" @click="signInWithFacebook" :disabled="loading" type="button">
          <i class="fab fa-facebook-f"></i>
        </button>
      </div>

      <div class="login-footer mt-4">
        Chưa có tài khoản? 
        <router-link to="/register" class="link-highlight">Đăng ký ngay</router-link>
      </div>

      <!-- Alert Section (Compact) -->
      <div v-if="error" class="alert-minimal mt-3 animated shake">
        <i class="fas fa-exclamation-circle mr-2"></i> {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/auth.service.js';

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      error: null,
      email: '',
      password: '',
      isMockMode: AuthService.isMockMode
    };
  },
  methods: {
    async handleAuthAction(action) {
      this.loading = true;
      this.error = null;
      try {
        const result = await action();
        if (result.success) this.$router.push('/');
        else this.error = result.error;
      } catch (err) {
        this.error = 'Có lỗi xảy ra, vui lòng thử lại';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    signInWithEmail() {
      this.handleAuthAction(() => AuthService.signInWithEmail(this.email, this.password));
    },
    signInWithGoogle() {
      this.handleAuthAction(() => AuthService.signInWithGoogle());
    },
    signInWithFacebook() {
      this.handleAuthAction(() => AuthService.signInWithFacebook());
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.login-wrapper {
  font-family: 'Inter', sans-serif;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top left, #4f46e5, #7c3aed);
  overflow: hidden;
}

.login-glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  color: #4f46e5;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 1rem;
}

h2 {
  font-weight: 700;
  color: #111827;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.text-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

.input-group-custom {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group-custom i {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
}

.input-group-custom input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border: 2px solid #f3f4f6;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.input-group-custom input:focus {
  border-color: #4f46e5;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.btn-primary-custom {
  width: 100%;
  padding: 0.9rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-custom:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.divider-text {
  display: flex;
  align-items: center;
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 1.5rem 0;
}

.divider-text::before, .divider-text::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e5e7eb;
  margin: 0 1rem;
}

.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.btn-social {
  padding: 0.7rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
}

.btn-social:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.google { color: #db4437; }
.facebook { color: #4267b2; }

.login-footer {
  font-size: 0.875rem;
  color: #4b5563;
}

.link-highlight {
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;
}

.alert-minimal {
  background: #fee2e2;
  color: #b91c1c;
  padding: 0.6rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
}

.animated.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 480px) {
  .login-glass-card {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>
