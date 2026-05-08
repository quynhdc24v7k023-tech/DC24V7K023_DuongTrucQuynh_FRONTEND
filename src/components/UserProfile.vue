<template>
  <div class="user-profile">
    <div class="dropdown">
      <button
        class="btn btn-link dropdown-toggle user-info"
        type="button"
        id="userDropdown"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <img
          v-if="user.photoURL"
          :src="user.photoURL"
          :alt="user.displayName"
          class="user-avatar"
        />
        <i v-else class="fas fa-user-circle user-avatar-icon"></i>
        <span class="user-name">{{ user.displayName || user.email }}</span>
      </button>

      <div class="dropdown-menu" aria-labelledby="userDropdown">
        <div class="dropdown-item user-details">
          <div class="user-email">{{ user.email }}</div>
          <div class="user-provider">
            <small class="text-muted">
              Đăng nhập qua {{ getProviderName(user.providerId) }}
            </small>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" @click="signOut">
          <i class="fas fa-sign-out-alt"></i>
          Đăng xuất
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service.js";

export default {
  name: "UserProfile",
  computed: {
    user() {
      return AuthService.getUserProfile();
    },
  },
  methods: {
    getProviderName(providerId) {
      switch (providerId) {
        case "google.com":
          return "Google";
        case "facebook.com":
          return "Facebook";
        case "password":
          return "Email";
        default:
          return "Unknown";
      }
    },

    async signOut() {
      try {
        const result = await AuthService.signOut();
        if (result.success) {
          this.$router.push("/login");
        } else {
          alert("Có lỗi xảy ra khi đăng xuất");
        }
      } catch (error) {
        console.error("Sign out error:", error);
        alert("Có lỗi xảy ra khi đăng xuất");
      }
    },
  },
};
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  color: white !important;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.user-avatar-icon {
  font-size: 32px;
  margin-right: 10px;
  color: white;
}

.user-name {
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-menu {
  min-width: 250px;
  right: 0;
  left: auto;
}

.user-details {
  padding: 0.5rem 1rem;
  pointer-events: none;
}

.user-email {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.user-provider {
  font-size: 0.875rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.dropdown-item i {
  margin-right: 0.5rem;
  width: 16px;
}

.dropdown-divider {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .user-name {
    display: none;
  }

  .user-avatar,
  .user-avatar-icon {
    margin-right: 0;
  }
}
</style>
