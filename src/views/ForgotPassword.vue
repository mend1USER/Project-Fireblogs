<!--Компонент в котором если пользователь забудет свой пароль 
может войти в свой аккаунт написав адрес электронной почты и ему должно 
отправиться сообщение с идентификацией акканута что бы поменять пароль-->

<template>
  <div class="reset-password">
    <!--Сначала пишем компонент с модальным окном когда пользователь отправит свой 
    адрес электронной почты и на экране плоьзователя будет окно с сообщением
              "If your account exists, you will receive a email";
-->
    <Modal
      v-if="modalActive"
      :modalMessage="modalMessage"
      v-on:close-modal="closeModal"
    />
    <!--Компонент loading спиннера -->
    <Loading v-if="loading" />
    <div class="form-wrap">
      <form class="reset">
        <p class="login-register">
          Back to
          <router-link class="router-link" :to="{ name: 'Login' }">
            Login
          </router-link>
        </p>
        <h2>Reset Password</h2>
        <p>Forgot your password? Enter your email to reset it</p>
        <div class="inputs">
          <div class="input">
            <input type="text" placeholder="Email" v-model="email" />
            <email class="icon" />
          </div>
        </div>
        <button @click.prevent="resetPassword">Reset</button>
        <div class="angle"></div>
      </form>
      <div class="background"></div>
    </div>
  </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg";
import Loading from "../components/Loading.vue";
import Modal from "../components/Modal.vue";
import firebase from "firebase";
import "firebase/auth";
export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      modalActive: false,
      modalMessage: "",
      loading: null,
    };
  },
  components: {
    email,
    Modal,
    Loading,
  },
  methods: {
    //Функция которая позволит поменять пароль если юзер забыл просто написав свой
    //адрес электорнной почты на котрый придет сообщение в котором будет опция поменять пароль
    //Сначала мы воспройзводим ЛОАДИНГ компонент пока файрстор найдет адрес электронной почты
    //Затем если такая почта существует то ФАЙРСТОР отправит опцию с сообщением где можно поменять пароль
    //с помощью метода sendPasswordResetEmail которая позволит поменять пароль если есть точный адрес электронной почты
    //в конце просто отключаем компонент ЛОАДИНГА и проявим модальное окно с сообщением
    resetPassword() {
      this.loading = true;
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.modalMessage =
            "If your account exists, you will receive a email";
          this.loading = false;
          this.modalActive = true;
        })
        //Если юзер напишет неправильно свой адрес то просто поймаем ошибку и выведем модальное окно с ошибкой
        .catch((err) => {
          this.modalMessage = err.message;
          this.loading = false;
          this.modalActive = true;
        });
    },
    closeModal() {
      this.modalActive = !this.modalActive;
      this.email = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-password {
  position: relative;
  .form-wrap {
    .reset {
      h2 {
        margin-bottom: 8px;
      }
      p {
        text-align: center;
        margin-bottom: 32px;
      }
    }
  }
}
</style>
