<!--Компонент для карточек блога -->

<template>
  <div class="blog-card">
    <!--Разметки внутри компонента карточек для блога Едит для редактирования карточек
    и Делете для удаления карточки блога
  
  Это часть шаблона Vue.js. v-model используется для создания 
  двусторонней привязки данных между элементом формы (в данном случае, чекбоксом) и переменной editPost.
Для начало в стэйт пишем значение null для editPost что бы можно было менять его значение-->
    <div v-show="editPost" class="icons">
      <div @click="editBlog" class="icon">
        <Edit class="edit" />
      </div>
      <div @click="deletePost" class="icon">
        <Delete class="delete" />
      </div>
    </div>
    <img :src="post.blogCoverPhoto" alt="" />
    <div class="info">
      <h4>
        {{ post.blogTitle }}
      </h4>
      <h6>
        Posted on:
        {{
          new Date(post.blogDate).toLocaleString("en-us", { dateStyle: "long" })
        }}
      </h6>
      <router-link
        class="link"
        :to="{ name: 'ViewBlog', params: { blogid: this.post.blogID } }"
        >View The Post <Arrow class="arrow"
      /></router-link>
    </div>
  </div>
</template>

<script>
import Arrow from "../assets/Icons/arrow-right-light.svg";
import Edit from "../assets/Icons/edit-regular.svg";
import Delete from "../assets/Icons/trash-regular.svg";
export default {
  name: "blogCard",
  //Пишем пропс что бы импортировать их в другие компоненты
  props: ["post"],
  components: {
    Arrow,
    Edit,
    Delete,
  },
  computed: {
    //Этот блок computed также создает геттер для переменной editPost,
    // но в контексте компонента Vue.js. Это может быть использовано в шаблоне компонента
    // для автоматического обновления когда editPost изменяется в хранилище Vuex.
    editPost() {
      return this.$store.state.editPost;
    },
  },
  methods: {
    //Функция удаления поста при вызове функций actions
    deletePost() {
      this.$store.dispatch("deletePost", this.post.blogID);
    },
    //Функция которая пушит в страницу редактирования после нажатия кнопки
    editBlog() {
      this.$router.push({
        name: "EditBlog",
        params: { blogid: this.post.blogID },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-card {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #fff;
  min-height: 420px;
  transition: 0.5s ease all;

  &:hover {
    transform: rotateZ(-1deg) scale(1.01);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.6);
  }

  .icons {
    display: flex;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 99;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      border-radius: 90%;
      background-color: #fff;
      transition: 0.5s ease all;

      &:hover {
        background-color: #303030;

        .edit,
        .delete {
          path {
            fill: #fff;
          }
        }
      }
      &:nth-child(1) {
        margin-right: 8px;
      }
    }
    .edit,
    .delete {
      pointer-events: none;
      height: 15px;
      width: auto;
    }
  }

  img {
    display: block;
    border-radius: 8px 8px 0 0;
    z-index: 1;
    width: 100%;
    min-height: 200px;
    object-fit: cover;
  }

  .info {
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 3;
    padding: 32px 16px;
    color: #000;

    h4 {
      padding-bottom: 8px;
      font-size: 20px;
      font-weight: 300;
    }

    h6 {
      font-size: 12px;
      font-weight: 400;
      padding-bottom: 16px;
    }

    .link {
      display: inline-flex;
      align-items: center;
      margin-top: auto;
      font-weight: 500;
      padding-top: 20px;
      font-size: 12px;
      padding-bottom: 4px;
      transition: 0.5s ease-in all;

      &:hover {
        color: rgba(48, 48, 48, 0.8);
      }

      .arrow {
        width: 10px;
      }
    }
  }
}
</style>
