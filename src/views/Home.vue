<template>
  <div class="home">
    <!--Импортируя компонент вставляем в тэмплэйт проходясь по каждому циклу иттерация что бы 
    на хоум пэйдже создовался пост который был написан в качестве свойство в BlogPost-->
    <BlogPost v-if="!user" :post="welcomeScreen" />
    <BlogPost
      :post="post"
      v-for="(post, index) in blogPostsFeed"
      :key="index"
    />
    <div class="blog-card-wrap">
      <div class="container">
        <h3>View More Recent Blogs</h3>
        <div class="blog-card">
          <!--Что бы вывести карточки блогов сначала импортируем их в хоум пэйдж 
          потом размечяем их в темплэйт и делаем метод с V-for так же как и мы высветили блогпост в главную страницу
        -->
          <BlogCard
            :post="post"
            v-for="(post, index) in blogPostsCards"
            :key="index"
          />
        </div>
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <!--Разметка для прифутера где просто вставили ссылку для регистрций аккаунта-->
        <h2>Never Miss a post. Register for free account today!</h2>
        <router-link class="router-button" to="#"
          >Register for FireBlogs <Arrow class="arrow arrow-light"
        /></router-link>
      </div>
    </div>
  </div>
</template>

<script>
//Импортируем компонент главной страницы в хоус пэйдж что бы отображало на экарне
import BlogPost from "../components/BlogPost.vue";
import BlogCard from "../components/blogCard.vue";
import Arrow from "../assets/Icons/arrow-right-light.svg";
export default {
  name: "Home",
  data() {
    return {
      //Просто псевдо компоненты для просто показа главной страницы
      welcomeScreen: {
        title: "Welcome",
        blogPost:
          "Weekly blog articles with all programming including HTML, CSS, JavaScript and more. Register today to never miss a post!",
        welcomeScreen: true,
        photo: "coding",
      },
      // sampleBlogPost: [
      //   {
      //     title: "This is a Filter Title",
      //     blogHTML: "This is a filter blog post title",
      //     blogCoverPhoto: "beautiful-stories",
      //   },
      //   {
      //     title: "This is a Filter Title",
      //     blogHTML: "This is a filter blog post title",
      //     blogCoverPhoto: "designed-for-everyone",
      //   },
      // ],
    };
  },
  components: {
    BlogPost,
    BlogCard,
    Arrow,
  },
  computed: {
    blogPostsFeed() {
      return this.$store.getters.blogPostsFeed;
    },
    blogPostsCards() {
      return this.$store.getters.blogPostsCards;
    },
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.blog-card-wrap {
  h3 {
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 32px;
  }
}

.updates {
  .container {
    padding: 100px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width: 800px) {
      padding: 125p 25px;
      flex-direction: row;
    }

    .router-button {
      display: flex;
      font-size: 14px;
      text-decoration: none;
      @media (min-width: 800px) {
        margin-left: auto;
      }
    }

    h2 {
      font-weight: 300;
      font-size: 32px;
      max-width: 425px;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      @media (min-width: 800px) {
        text-align: initial;
        font-size: 40px;
      }
    }
  }
}
</style>
