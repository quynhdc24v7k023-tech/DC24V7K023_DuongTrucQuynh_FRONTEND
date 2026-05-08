<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a href="/" class="navbar-brand">Ứng dụng Quản lý danh bạ</a>
    <div class="mr-auto navbar-nav">
      <li class="nav-item" v-if="isAuthenticated">
        <router-link :to="{ name: 'contactbook' }" class="nav-link">
          Danh bạ
          <i class="fas fa-address-book"></i>
        </router-link>
      </li>
    </div>
    <div class="ml-auto d-flex align-items-center" v-if="isAuthenticated">
      <UserProfile />
      <button class="btn btn-outline-light btn-sm ml-2" @click="signOut">
        <i class="fas fa-sign-out-alt"></i>
        Đăng xuất
      </button>
    </div>
  </nav>
</template>

<script>
import UserProfile from '@/components/UserProfile.vue';
import AuthService from '@/services/auth.service.js';

export default {
  name: 'AppHeader',
  components: {
    UserProfile,
  },
  data() {
    return {
      isAuthenticated: false,
      unsubscribe: null,
    };
  },
  mounted() {
    this.unsubscribe = AuthService.onAuthStateChange((user) => {
      this.isAuthenticated = AuthService.isAuthenticated();
    });

    this.isAuthenticated = AuthService.isAuthenticated();
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async signOut() {
      const result = await AuthService.signOut();
      if (result.success) {
        this.$router.push({ name: 'login' });
      } else {
        alert('Có lỗi xảy ra khi đăng xuất');
      }
    },
  },
};
</script>
