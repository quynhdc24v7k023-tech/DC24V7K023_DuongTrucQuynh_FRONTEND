<template>
  <div class="page">
    <h4>Thêm mới Liên hệ</h4>
    <ContactForm :contact="contact" @submit:contact="createContact" />
    <p>{{ message }}</p>
  </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import ContactService from "@/services/contact.service";
export default {
  components: {
    ContactForm,
  },
  data() {
    return {
      contact: {
        name: "",
        email: "",
        address: "",
        phone: "",
        favorite: false,
      },
      message: "",
    };
  },
  methods: {
    async createContact(data) {
      try {
        const created = await ContactService.create(data);
        alert("Liên hệ mới đã được tạo.");
        if (created && created._id) {
          this.$router.push({
            name: "contact.edit",
            params: { id: created._id },
          });
        } else {
          this.$router.push({ name: "contactbook" });
        }
      } catch (error) {
        console.log(error);
        this.message = "Không thể tạo liên hệ. Vui lòng thử lại.";
      }
    },
  },
};
</script>
