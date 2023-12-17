<!--Компонент для регистраций аккаунта пользователя-->

<template>
  <div class="form-wrap">
    <form class="register">
      <p class="login-register">
        Already have an account?
        <router-link class="router-link" :to="{ name: 'Login' }">
          Login
        </router-link>
      </p>
      <h2>Create Your FireBlog Account</h2>
      <div class="inputs">
        <!--Раздел инпутов где юзер должен заполнить данные о нем-->
        <div class="input">
          <input type="text" placeholder="First Name" v-model="firstName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Last Name" v-model="lastName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Username" v-model="username" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <email class="icon" />
        </div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
          <password class="icon" />
        </div>
        <div v-show="error" class="error">{{ this.errorMsg }}</div>
      </div>
      <button @click.prevent="register">Sign up</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg";
import password from "../assets/Icons/lock-alt-solid.svg";
import user from "../assets/Icons/user-alt-light.svg";
import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseInit";
export default {
  name: "Register",
  components: {
    email,
    password,
    user,
  },
  data() {
    return {
      //Начальные состояния инпутов внутри компонента
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      errorMsg: "",
      error: null,
    };
  },
  methods: {
    //Асинхронная функция в котором сначала мы делаем валидацию форм потом если один из полей
    //не заполнен или не правильно написан то сразу же отправляем ошибку с специальным сообщением
    //потом если все формы заполнены то запускаем другую функцию которая была написана с помощью Firebase
    //
    async register() {
      if (
        this.email !== "" &&
        this.password !== "" &&
        this.firstName !== "" &&
        this.lastName !== "" &&
        this.username !== ""
      ) {
        this.error = false;
        this.errorMsg = "";
        //Здесь начинается функция в котором юзера будут рагистрировать в базу Firebase
        //Сначала обьект firebaseAuth в которую зашиваем функцию аутентифакиций Firebase
        //потом используем createUserWithEmailAndPassword для регистраций юзера указанным паролем и адресом почты
        const firebaseAuth = await firebase.auth();
        const createUser = await firebaseAuth.createUserWithEmailAndPassword(
          this.email,
          this.password
        );
        //Переменная result которая получает инфу о юзере
        //В этой переменной dataBase создается идентификатор пользователя что бы юзер смог успеншно аутентифицироваться
        // в специальный коллекций users в Firebase в котором будет храниться данные юзера со свойм идентифицированным номеров
        //После всех операций юзера перенаправляют в главную страницу
        const result = await createUser;
        const dataBase = db.collection("users").doc(result.user.uid);
        await dataBase.set({
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email,
        });
        this.$router.push({ name: "Home" });
        return;
      }
      this.error = true;
      this.errorMsg = "Please fill out all the fields";
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.register {
  h2 {
    max-width: 350px;
  }
}
</style>
