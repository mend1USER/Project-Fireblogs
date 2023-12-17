<!--Компонент для создания поста с фото с зоглавным тайтлом с помощью библиотеки Quill которая предоставит легкое встрайвание изоброжений -->

<template>
  <div class="create-post">
    <!--Компонент для предпосмотра фото-->
    <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />
    <Loading v-show="loading" />
    <div class="container">
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ this.errorMsg }}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Upload Cover Photo</label>
          <!--Элемент инпут с типом файл который будет позволять выбирать файлы с идентификатором blogPhoto 
          обработчик события @change, который вызывает метод fileChange, и атрибут accept, который ограничивает типы файлов, которые можно выбрать.-->
          <input
            type="file"
            id="blog-photo"
            @change="fileChange"
            ref="blogPhoto"
            accept=".png, .jpg, ,jpeg"
          />
          <button
            @click="openPreview"
            class="preview"
            :class="{ 'button-inactive': !this.$store.state.blogPhotoFileURL }"
          >
            Preview Photo
          </button>
          <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>
        </div>
      </div>
      <div class="editor">
        <!--Библиотека для реализаций текста на сайте первый пункт передает параметры
        вотрой пункт связывает модель данных третьи можно использовать пользовательский обработчик собитий
      четвертый слушает событие и вызывает метод при добавлений изображений-->
        <vue-editor
          :editorOptions="editorSettings"
          v-model="blogHTML"
          useCustomImageHandler
          @image-added="imageHandler"
        />
      </div>
      <div class="blog-actions">
        <button @click="uploadBlog">Publish Blog</button>
        <router-link class="router-button" :to="{ name: 'BlogPreview' }"
          >Post Preview</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
//Импортируем нужные компоненты и файрбэйс с библиотекой Quill
import Loading from "../components/Loading.vue";
import Quill from "quill";
import firebase from "firebase/app";
import "firebase/storage";
import db from "../firebase/firebaseInit";
import BlogCoverPreview from "../components/blogCoverPreview.vue";
//Встрайваем Quill в наш компонент с всеми плюшкаим по типу кастомизаций изоброжений
//И начальное который можно увидеть на сайт в котором будет пройсходить основная функция CreatePost
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);
export default {
  name: "CreatePost",
  data() {
    return {
      file: null,
      error: null,
      errorMsg: null,
      loading: null,
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
    };
  },
  methods: {
    //Функция которая будет позволять выбирать файл из данных компьютера
    fileChange() {
      //Получаем первый и едиственный по индексу файл из элемента инпут и сохраняем его в свойство file
      this.file = this.$refs.blogPhoto.files[0];
      //Получаем имя файла
      const fileName = this.file.name;
      //Вызываем мутацию что бы создать URL адрес и что бы сохранить адрес в хранилище
      this.$store.commit("fileNameChange", fileName);
      this.$store.commit("createFileURL", URL.createObjectURL(this.file));
    },
    //Метод для предпосмотра фото
    openPreview() {
      this.$store.commit("openPhotoPreview");
    },
    //Метод который позволяет загрузить файл фото в редактор сначал сохранив его в память файрбэйз
    //Сначала пишем параметры который будем использовать в блоке разберем по ходу
    imageHandler(file, Editor, cursorLocation, resetUploader) {
      //ссылка на хранилище файрбэз
      const storageRef = firebase.storage().ref();
      //ссылка на документ в хранлище для загрузки
      const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`);
      //Файл добавляется в хранилище Firebase с использованием put
      docRef.put(file).om(
        //state_changed обрабатываются изменения состояния загрузки
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (err) => {
          console.log(err);
        },
        async () => {
          //В случае загрузки файла получается его URL
          const downloadURL = await docRef.getDownloadURL();
          //И с помощью Editor.insertEmbed изображение вставляется в текст редактора
          //в конце вызывается функция resetUploader что бы сбросить загрузчик изображений
          Editor.insertEmbed(cursorLocation, "image", downloadURL);
          resetUploader();
        }
      );
    },
    //Пожалуй главная фича и функция проекта это кнопка после нажатия который опубликует официально пока внутри ФАЙРСТОР блог пользователя
    //Сначала в блоке пишем условие if если в блоге Загаловок и текст в публикаций не равно 0 то функция публикует блог
    //А если публикация пуста то мы отправляем ошибку что нету коонкретноог текста или файла с изображением
    uploadBlog() {
      if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
        //Еще одно условие если юзер напишет и текст и вместе с ней изображение то мы отправим функцию публикаций
        //И сначала пишем метод который будет загружать изображение в редактор но с перва мы должны сделать ссылку
        //На Файрбэйз и отправить фото туда и брать его с памяти Файрбэйз и получаем URL адрес
        if (this.file) {
          this.loading = true;
          const storage = firebase.storage().ref();
          const docRef = storage.child(
            `documents/BlogCoverPhotos/${this.$store.state.blogPhotoName}`
          );
          docRef.put(this.file).on(
            "state_changed",
            (snapshot) => {
              console.log(snapshot);
            },
            (err) => {
              console.log(err);
              this.loading = false;
            },
            //Асинхронная функция которая добавляет блог в базу данных
            //и сначала первая строка кода получает URL адрес загруженного изображения с импользованием метода getDownloadURL
            //и перед получением пишем await что бы оно срабатывало когда получит URL адрес изображения
            async () => {
              const downloadURL = await docRef.getDownloadURL();
              //Это строка получает текущую метку времени с помощью метода Date.now
              const timestamp = await Date.now();
              //Создается ссылка на документ в коллекций о блогах в базе данных
              const dataBase = await db.collection("blogPosts").doc();

              //Здесь пройсходит установка данных о самой публикаций в коллекцию
              await dataBase.set({
                blogID: dataBase.id,
                blogHTML: this.blogHTML,
                blogCoverPhoto: downloadURL,
                blogCoverPhotoName: this.blogCoverPhotoName,
                blogTitle: this.blogTitle,
                profileId: this.profileId,
                date: timestamp,
              });
              //Когда блог успешно будет в коллекций потом мы воспользуемся нашей функцией getPost
              //который берет пост из коллекций баз данных и будет приносить их на сайт с помощью метода dispatch
              //что бы активировать функцию в actions в index js
              await this.$store.dispatch("getPost");
              //После делаем анимацию загрузки и затем пушим юзера в страницу где можно посмотреть публикацию
              this.loading = false;
              this.$router.push({
                name: "ViewBlog",
                params: { blogid: dataBase.id },
              });
            }
          );
          return;
        }
        //Валидация при который отправляем ошибку если в публикаций нету текста или изображения
        //который будет длиться только на 5 секунд
        this.error = true;
        this.errorMsg = "Please ensure you uploaded a cover photo!";
        setTimeout(() => {
          this.error = false;
        }, 5000);
        return;
      }
      this.error = true;
      this.errorMsg = "Please ensure Blog Title & Blog Post has been filled!";
      setTimeout(() => {
        this.error = false;
      }, 5000);
      return;
    },
  },
  computed: {
    //Это вычисляемые свойство  которые взаймодействуют с данными хранилища во Vuex
    //При изминений данных которых в хранилище эти свойтво будут автомотически пересчитоваться обеспечивая реактивность
    profileId() {
      //profileId, которое возвращает значение profileId из глобального состояния хранилища Vuex
      return this.$store.state.profileId;
    },
    blogCoverPhotoName() {
      //blogCoverPhotoName, которое возвращает значение blogPhotoName из глобального состояния хранилища Vuex.
      return this.$store.state.blogPhotoName;
    },
    blogTitle: {
      //blogTitle с использованием геттера и сеттера. Геттер возвращает значение blogTitle из глобального состояния хранилища,
      // а сеттер вызывает мутацию updateBlogTitle, чтобы обновить blogTitle в хранилище.
      get() {
        return this.$store.state.blogTitle;
      },
      set(payload) {
        this.$store.commit("updateBlogTitle", payload);
      },
    },
    blogHTML: {
      //blogHTML с использованием геттера и сеттера. Геттер возвращает значение blogHTML из глобального состояния хранилища,
      // а сеттер вызывает мутацию newBlogPost, чтобы обновить blogHTML в хранилище.
      get() {
        return this.$store.state.blogHTML;
      },
      set(payload) {
        this.$store.commit("newBlogPost", payload);
      },
      //Это все вычисляесые свойство которые будут реактивно меняться во время написания к примеру блога
    },
  },
  components: { BlogCoverPreview, Loading },
};
</script>

<style lang="scss" scoped>
.create-post {
  position: relative;
  height: 100%;

  button {
    margin-top: 0;
  }

  .router-button {
    text-decoration: none;
    color: #fff;
  }

  label,
  button,
  .router-button {
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    color: #fff;
    padding: 12px 24px;
    background-color: #303030;
    text-decoration: none;

    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }

  .container {
    position: relative;
    height: 100%;
    padding: 10px 25px 60px;
  }

  // error styling
  .invisible {
    opacity: 0 !important;
  }

  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #303030;
    transition: 0, 5s ease all;
    opacity: 1;

    p {
      font-size: 14px;
    }

    span {
      font-weight: 600;
    }
  }

  .blog-info {
    display: flex;
    margin-bottom: 32px;

    input:nth-child(1) {
      min-width: 300px;
    }

    input {
      transition: 0.5s ease-in-out all;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid #303030;

      &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 #303030;
      }
    }

    .upload-file {
      flex: 1;
      margin-left: 16px;
      position: relative;
      display: flex;

      input {
        display: none;
      }

      .preview {
        margin-left: 16px;
        text-transform: initial;
      }

      span {
        font-size: 12px;
        margin-left: 16px;
        align-items: center;
      }
    }
  }

  .editor {
    height: 60vh;
    display: flex;
    flex-direction: column;

    .quillWrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .ql-container {
      display: flex;
      height: 100%;
      flex-direction: column;
      overflow: scroll;
    }

    .ql-editor {
      padding: 20px 16px 30px;
    }
  }

  .blog-actions {
    margin-top: 75px;

    button {
      margin-right: 16px;
    }
  }
}
</style>
