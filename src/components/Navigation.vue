<!--Компонент для навигаций в сайте со стилями и для 
стилей для адаптивной верстки -->

<template>
  <header>
    <nav class="container">
      <div class="branding">
        <!--Раздел компонента с сэндвич баттоном для навигаций по сайту и реактивной ссылкой-->
        <router-link class="header" :to="{ name: 'Home' }">
          FireBlogs
        </router-link>
      </div>
      <div class="nav-links">
        <ul v-show="!mobile">
          <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
          <router-link class="link" :to="{ name: 'Blogs' }">Blogs</router-link>
          <router-link class="link" :to="{ name: 'CreatePost' }"
            >Create Post</router-link
          >
          <router-link v-show="!user" class="link" :to="{ name: 'Login' }"
            >Login/Register</router-link
          >
        </ul>
        <!--Раздел для профильного меню пользователя где будет компонент админа и профиля и кнопка через который можно выйти из аккаунта -->
        <div
          v-if="user"
          @click="toggleProfileMenu"
          class="profile"
          ref="profile"
        >
          <span>{{ this.$store.state.profileInitials }}</span>
          <div v-show="profileMenu" class="profile-menu">
            <div class="info">
              <p class="initials">{{ this.$store.state.profileInitials }}</p>
              <div class="right">
                <p>
                  {{ this.$store.state.profileFirstName }}
                  {{ this.$store.state.profileLastName }}
                </p>
                <p>{{ this.$store.state.profileUserName }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <div class="option">
                <router-link class="option" :to="{ name: 'Profile' }">
                  <userIcon class="icon" />
                  <p>Profile</p>
                </router-link>
              </div>
              <div class="option">
                <router-link class="option" :to="{ name: 'Admin' }">
                  <adminIcon class="icon" />
                  <p>Admin</p>
                </router-link>
              </div>
              <div @click="signOut" class="option">
                <signOutIcon class="icon" />
                <p>Sign Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <menuIcon @click="toggleMobileNav" class="menu-icon" v-show="mobile" />
    <!--Раздел для мобильного адаптивного экрана и с небольшой анимацией-->
    <transition name="mobile-nav">
      <ul class="mobile-nav" v-show="mobileNav">
        <router-link class="link" :to="{ name: 'Home' }">Home</router-link>
        <router-link class="link" :to="{ name: 'Blogs' }">Blogs</router-link>
        <router-link class="link" :to="{ name: 'CreatePost' }"
          >Create Post</router-link
        >
        <router-link v-show="!user" class="link" :to="{ name: 'Login' }"
          >Login/Register</router-link
        >
      </ul>
    </transition>
  </header>
</template>

<script>
//Импорт иконок для сайта
import menuIcon from "../assets/Icons/bars-regular.svg";
import adminIcon from "../assets/Icons/user-crown-light.svg";
import userIcon from "../assets/Icons/user-alt-light.svg";
import signOutIcon from "../assets/Icons/sign-out-alt-regular.svg";
import firebase from "firebase";
import "firebase/auth";
export default {
  name: "navigation",
  components: {
    menuIcon,
    adminIcon,
    userIcon,
    signOutIcon,
  },
  //Функция для того что бы сайт понимал через какое устройстве
  //оно сейчас и что бы оно само адаптировало верстку
  //сначала делаем раективные переменные обозначая налл потому что в начально этом этапе будет непонятно
  //и переходим в методы написать функцию
  data() {
    return {
      profileMenu: null,
      mobile: null,
      mobileNav: null,
      windowWidth: null,
    };
  },
  created() {
    //Ивент листенер в котором прослушивается функция разрешения экрана
    //потом если одно из двух условий правильное то вызывается собитие именения экрана браузера
    window.addEventListener("resize", this.checkScreen);
    this.checkScreen();
  },
  methods: {
    //Здесь написано простая логика что бы понимать на каком устройстве сейчас пользуется юзер
    //и если ответ соответствует одному из схожих то функция в конце устанавливает одну из двух условий в зависимости от условия.
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth <= 750) {
        this.mobile = true;
        return;
      }
      this.mobile = false;
      this.mobileNav = false;
      return;
    },
    toggleMobileNav() { //Метод который будет переключать в зависимости от экрана пользователя
      this.mobileNav = !this.mobileNav;
    },
    toggleProfileMenu(e) {
      //функция при котором открывается и закрываеся профильное меню
      //Пишем что клик будет равен к рефу профайль что бы когда юзер нажимал по нему
      //то размер был равен всему компоненту профайл меню
      if (e.target === this.$refs.profile) {
        this.profileMenu = !this.profileMenu;
      }
    },

    signOut() {
      //Фунцкция что бы выйти из аккаунта с помощью метода из Файрбэйс
      //А что бы вернуть полный вид сайта без юзера мы просто пишем computed свойство в котором будем возвращать значение user
      //и просто в в тэмплэйтах с помощью v-if свойств пишем отрицательное значение юзер
      firebase.auth().signOut();
      window.location.reload();
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.65);
  z-index: 99;

  .link {
    font-weight: 500;
    padding: 0 8px;
    transition: 0.3s color ease;

    &:hover {
      color: #1eb8b8;
    }
  }

  nav {
    display: flex;
    padding: 25px 0;

    .branding {
      display: flex;
      align-items: center;

      .header {
        font-weight: 600;
        font-size: 24px;
        color: #000;
        text-decoration: none;
      }
    }

    .nav-links {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex: 1;

      ul {
        margin-right: 32px;

        .link {
          margin-right: 32px;
        }

        .link:last-child {
          margin-right: 0;
        }
      }

      .profile {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: #fff;
        background-color: #303030;

        span {
          pointer-events: none;
        }

        .profile-menu {
          position: absolute;
          top: 60px;
          right: 0;
          width: 250px;
          background-color: #303030;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.6);

          .info {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #fff;

            .initials {
              position: initial;
              width: 40px;
              height: 40px;
              background-color: #fff;
              color: #303030;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              display: flex;
            }

            .right {
              flex: 1;
              margin-left: 24px;

              p:nth-child(1) {
                font-size: 14px;
              }

              p:nth-child(2),
              p:nth-child(3) {
                font-size: 12px;
              }
            }
          }

          .options {
            padding: 15px;
            .option {
              text-decoration: none;
              color: #fff;
              display: flex;
              align-items: center;
              margin-bottom: 12px;

              .icon {
                width: 18px;
                height: auto;
              }
              p {
                font-size: 14px;
                margin-left: 12px;
              }
              &:last-child {
                margin-bottom: 0px;
              }
            }
          }
        }
      }
    }
  }

  .menu-icon {
    cursor: pointer;
    position: absolute;
    top: 32px;
    height: 25px;
    width: auto;
    right: 25px;
  }

  .mobile-nav {
    padding: 20px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: #303030;
    top: 0;
    left: 0;

    .link {
      padding: 15px 0;
      color: #fff;
    }
  }

  .mobile-nav-enter-active,
  .mobile-nav-leave-active {
    transition: all 1s ease;
  }

  .mobile-nav-enter {
    transform: translateX(-250px);
  }

  .mobile-nav-enter-to {
    transform: translateX(0);
  }

  .mobile-nav-leave-to {
    transform: translateX(-250px);
  }
}
</style>
