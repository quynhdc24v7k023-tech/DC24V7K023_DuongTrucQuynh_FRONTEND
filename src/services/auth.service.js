import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
  isFirebaseConfigured,
} from "./firebase.js";

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.isFirebaseReady = isFirebaseConfigured;

    if (this.isFirebaseReady) {
      this.currentUser = auth.currentUser;
      onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        this.notifyAuthStateListeners(user);
      });
    } else {
      this.currentUser = this.loadUserFromStorage();
      this.notifyAuthStateListeners(this.currentUser);
    }
  }

  get isMockMode() {
    return !this.isFirebaseReady;
  }

  async signInWithEmail(email, password) {
    if (!email || !password) {
      return { success: false, error: "Email và mật khẩu không được để trống" };
    }

    if (this.isMockMode) {
      const users = JSON.parse(localStorage.getItem("mockUsers") || "[]");
      const user = users.find(
        (item) => item.email === email && item.password === password,
      );

      if (!user) {
        return { success: false, error: "Email hoặc mật khẩu không đúng." };
      }

      this.currentUser = { ...user };
      delete this.currentUser.password;
      this.saveUserToStorage(this.currentUser);
      this.notifyAuthStateListeners(this.currentUser);

      return { success: true, user: this.currentUser, provider: "email" };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      this.currentUser = result.user;
      return { success: true, user: this.currentUser, provider: "email" };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  async signUpWithEmail(email, password, displayName) {
    if (!email || !password || !displayName) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    }

    if (this.isMockMode) {
      const existingUsers = JSON.parse(
        localStorage.getItem("mockUsers") || "[]",
      );
      if (existingUsers.some((user) => user.email === email)) {
        return { success: false, error: "Email đã được sử dụng." };
      }

      const mockUser = {
        uid: `mock-user-${Date.now()}`,
        displayName,
        email,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
        providerData: [{ providerId: "password" }],
        password,
      };

      existingUsers.push(mockUser);
      localStorage.setItem("mockUsers", JSON.stringify(existingUsers));

      this.currentUser = { ...mockUser };
      delete this.currentUser.password;
      this.saveUserToStorage(this.currentUser);
      this.notifyAuthStateListeners(this.currentUser);

      return { success: true, user: this.currentUser, provider: "email" };
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(result.user, { displayName });
      this.currentUser = auth.currentUser;
      return { success: true, user: this.currentUser, provider: "email" };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  async signInWithGoogle() {
    if (this.isMockMode) {
      const mockUser = {
        uid: `mock-google-${Date.now()}`,
        displayName: "Google Demo User",
        email: "google.demo@example.com",
        photoURL: "https://lh3.googleusercontent.com/a/default-user",
        providerData: [{ providerId: "google.com" }],
      };

      this.currentUser = mockUser;
      this.saveUserToStorage(mockUser);
      this.notifyAuthStateListeners(mockUser);
      return { success: true, user: mockUser, provider: "google" };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      this.currentUser = result.user;
      return { success: true, user: this.currentUser, provider: "google" };
    } catch (error) {
      return {
        success: false,
        error: "Đăng nhập Google thất bại: " + error.message,
      };
    }
  }

  async signInWithFacebook() {
    if (this.isMockMode) {
      const mockUser = {
        uid: `mock-fb-${Date.now()}`,
        displayName: "Facebook Demo User",
        email: "fb.demo@example.com",
        photoURL: "https://graph.facebook.com/v10.0/123456789/picture",
        providerData: [{ providerId: "facebook.com" }],
      };

      this.currentUser = mockUser;
      this.saveUserToStorage(mockUser);
      this.notifyAuthStateListeners(mockUser);
      return { success: true, user: mockUser, provider: "facebook" };
    }

    try {
      const result = await signInWithPopup(auth, facebookProvider);
      this.currentUser = result.user;
      return { success: true, user: this.currentUser, provider: "facebook" };
    } catch (error) {
      return {
        success: false,
        error: "Đăng nhập Facebook thất bại: " + error.message,
      };
    }
  }

  async signOut() {
    if (this.isMockMode) {
      this.currentUser = null;
      this.clearUserFromStorage();
      this.notifyAuthStateListeners(null);
      return { success: true };
    }

    try {
      await firebaseSignOut(auth);
      this.currentUser = null;
      this.notifyAuthStateListeners(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(
        (l) => l !== callback,
      );
    };
  }

  notifyAuthStateListeners(user) {
    this.authStateListeners.forEach((callback) => callback(user));
  }

  getUserProfile() {
    const user = this.currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      providerId: user.providerData?.[0]?.providerId,
    };
  }

  getErrorMessage(code) {
    switch (code) {
      case "auth/user-not-found":
        return "Không tìm thấy tài khoản.";
      case "auth/wrong-password":
        return "Mật khẩu không đúng.";
      case "auth/invalid-email":
        return "Email không hợp lệ.";
      case "auth/email-already-in-use":
        return "Email đã được sử dụng.";
      case "auth/weak-password":
        return "Mật khẩu quá yếu.";
      default:
        return "Có lỗi xảy ra. Vui lòng thử lại.";
    }
  }

  saveUserToStorage(user) {
    localStorage.setItem("mockAuthUser", JSON.stringify(user));
  }

  loadUserFromStorage() {
    const userData = localStorage.getItem("mockAuthUser");
    return userData ? JSON.parse(userData) : null;
  }

  clearUserFromStorage() {
    localStorage.removeItem("mockAuthUser");
  }
}

export default new AuthService();
