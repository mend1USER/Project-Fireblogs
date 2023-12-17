<!---Компонент для просмотра постов написанных вами-->

<template>
  <div class="post-view" v-if="currentBlog">
    <div class="container quillWrapper">
      <h2>{{ this.currentBlog[0].blogTitle }}</h2>
      <!--Раздел что бы выявить дату опубликования поста-->
      <h4>
        Posted on :
        {{
          new Date(this.currentBlog[0].blogDate).toLocaleString("en-us", {
            dataStyle: "long",
          })
        }}
      </h4>
      <img :src="this.currentBlog[0].blogCoverPhoto" alt="" />
      <div
        class="post-content ql-editor"
        v-html="this.currentBlog[0].blogHTML"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewBlog",
  data() {
    return {
      currentBlog: null,
    };
  },
  async mounted() {
    //Здесь пройсходит фильтрация массива blogPosts при условий будут выбираться те посты которые
    // У которых blogID совпадает  с параметром маршрута blogid
    //что бы было полезно отображать конкртеный блог на странице или ссылаться на них Template
    this.currentBlog = await this.$store.state.blogPosts.filter((post) => {
      return post.blogID === this.$route.params.blogid;
    });
  },
};
</script>

<style lang="scss">
.post-view {
  h4 {
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 24px;
  }
}
</style>
