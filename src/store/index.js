import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import "firebase/auth";
import db from "../firebase/firebaseInit";
Vue.use(Vuex);

export default new Vuex.Store({
  //Здесь в начальном состояний мы пишем значение данных которые будут реактивными
  state: {
    blogPosts: [],
    postLoaded: null,
    blogHTML: "Write your blog title here...",
    blogTitle: "",
    blogPhotoName: null,
    blogPhotoFileURL: null,
    blogPhotoPreview: null,
    editPost: null,
    //Значения для данных каррент юзера
    //потом в экшенах пишем функцию которая будет получать информацию о пользователе
    //из баз данных файрстор
    user: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null,
    profileInitials: null,
  },
  mutations: {
    //Мутация для изменения состояния хранилища стэйт

    //Мутация которые будут менять содержимое HTML и загловок блога
    newBlogPost(state, payload) {
      state.blogHTML = payload;
    },
    updateBlogTitle(state, payload) {
      state.blogTitle = payload;
    },
    //Мутация которая устанавливает новое имя
    fileNameChange(state, payload) {
      state.blogPhotoName = payload;
    },
    //Мутация устанавливает новый URL адрес
    createFileURL(state, payload) {
      state.blogPhotoFileURL = payload;
    },
    //Мутация для просмотра фото
    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview;
    },
    //Это мутация Vuex под названием toggleEditPost.
    //Мутации используются для изменения состояния в хранилище Vuex.
    //Эта мутация принимает состояние и новое значение payload для переменной editPost
    toggleEditPost(state, payload) {
      state.editPost = payload;
      console.log(state.editPost);
    },
    //Мутация о инфо юзера где начальное состояние будет меняться и будет содержать информацию о юзере
    updateUser(state, payload) {
      state.user = payload;
    },
    //Мутация для функций получения данных юзера
    //Эта мутация принимает два параметра первое состояние хранилища и второе doc документ баз данных Файрстор
    //в мутаций пишем начальное значение переменных состояния потом на этой основе меняем информацию о профиле юзера
    setProfileInfo(state, doc) {
      state.profileId = doc.id;
      state.profileEmail = doc.data().email;
      state.profileFirstName = doc.data().firstName;
      state.profileLastName = doc.data().lastName;
      state.profileUsername = doc.data().username;
    },
    //Мутация для функций получения данных юзера
    //Эта мутация вычисляет имя фамилию пользователя и использует регулярное выражение что бы взять букву
    //Имени и фамилий а затем обьединяет их это нужно для компонента показывания параметров юзера
    setProfileInitials(state) {
      state.profileInitials =
        state.profileFirstName.match(/(\b\S)?/g).join("") +
        state.profileLastName.match(/(\b\S)?/g).join("");
    },
    //Это мутация которому передается первый элемент массива после инициализаций текущего блога
    //и в мутаций оно принимает начальное состояние после устанавливает измененное состояние
    setBlogState(state, payload) {
      state.blogTitle = payload.blogTitle;
      state.blogHTML = payload.blogHTML;
      state.blogPhotoFileURL = payload.blogCoverPhoto;
      state.blogPhotoName = payload.blogCoverPhotoName;
    },
    //Мутация для удаления удаленного поста из массива
    //тут пройсходит фильтрация массива оставляя те у которых айди не совпадает с парметром payload
    //и присвайваем результат обратно в состояние blogPost что бы обновлять хранилище
    //В общем таким образом в компоненте при вызове функций пост удаляется в коллекций в базе данных
    //и в конце вызывается мутация при котором обновляется состоянине в хранилище
    filterBlogPost(state, payload) {
      state.blogPosts = state.blogPosts.filter(
        (post) => post.blogID !== payload
      );
    },
    //Мутаций для изменения информаций о пользователе
    changeFirstName(state, payload) {
      state.profileFirstName = payload;
    },
    changeLastName(state, payload) {
      state.profileLastName = payload;
    },
    changeUsername(state, payload) {
      state.profileUsername = payload;
    },
  },
  getters: {
    //Этот геттер возвращает подмножество массива blogPosts из состояния Vuex
    // Используется метод slice(0, 2), чтобы вернуть первые два элемента массива
    blogPostsFeed(state) {
      return state.blogPosts.slice(0, 2);
    },
    //Этот геттер также возвращает подмножество массива blogPosts, но в этом случае используется slice(2, 6)
    // чтобы вернуть элементы массива с индексами от 2 до 5
    //И импортируем геттеры в Home компонент и BlogPost
    blogPostsCards(state) {
      return state.blogPosts.slice(2, 6);
    },
  },
  actions: {
    //Асинхронная функция в параметрах написан  коммит что бы вызвать мутацию которые будут менять состояние хранилища
    //Потом создается ссылка на пользователя в коллекций Users в базе данных Firestore который идентифицирует пользователя через UID (идентификатором пользователя)
    //Затем в переменной const dbResults = await dataBase.get(); пройсходит асинхронный запрос к базе данных для получение данных пользователя
    //с помощью get запроса
    //И в конце вызываем мутацию к переменным передавая в нее результаты данных пользователя

    async getCurrentUser({ commit }) {
      const dataBase = await db
        .collection("users")
        .doc(firebase.auth().currentUser.uid);
      const dbResults = await dataBase.get();
      commit("setProfileInfo", dbResults);
      commit("setProfileInitials");
      console.log(dbResults);
    },
    //Асинхронная функция которая будет делать get() запрос  к коллекция на ссылку blogPosts что бы получить результаты запроса
    async getPost({ state }) {
      const dataBase = await db.collection("blogPosts").orderBy("date", "desc");
      const dbResults = await dataBase.get();
      //тут уже перебираются результаты запроса методом forEach на каждый элемент поста
      dbResults.forEach((doc) => {
        //Это условие при котором проверяется не существует ли пост с таким же blogID что бы предотвратить дублирование постов
        //Если такого поста не было найдена то создается обьекст data которая будет содержать параметры из документа базы данных которые написаны внизу
        if (!state.blogPosts.some((post) => post.blogID === doc.id)) {
          const data = {
            blogID: doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
            blogCoverPhotoName: doc.data().blogCoverPhotoName,
          };
          //после обьект дата со всеми данными добавляется в в массив blogPosts
          state.blogPosts.push(data);
        }
      });
      //Указние что пост был успешно загружен
      state.postLoaded = true;
    },
    //Функция для обновления поста с параметром коммит для изменения состояния и payload что бы передать действие
    //затем dispatch что бы запустить action функцию которая запустит публикацию поста
    async updatePost({ commit, dispatch }, payload) {
      commit("filterBlogPost", payload);
      await dispatch("getPost");
    },
    //Асинхронная функция принимающяя в параметрах коммит что бы вызвать мутацию и pаyload идентификатор для удаляемого поста
    //сначала создаем ссылку для документа коллекций
    //затем выполняется удаление документа и вызывается мутация с передачей парметра
    async deletePost({ commit }, payload) {
      const getPost = await db.collection("blogPosts").doc(payload);
      await getPost.delete();
      commit("filterBlogPost", payload);
    },
    //Асинхронная функция которая принимет коммит что бы вызвать мутирование и стэйт для доступа к состоянию хранилища
    //потом создается ссылка на документ в коллекций users в файрстор что бы использывать айди пользователя
    //затем мы обнавляем данные с Файрстор начальных состояний иформация о пользователе
    //и в конце вызывается мутация setProfileInitials которая пишет инициалы юзера из начальных букв юзера
    async updateUserSettings({ commit, state }) {
      const dataBase = await db.collection("users").doc(state.profileId);
      await dataBase.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUsername,
      });
      commit("setProfileInitials");
    },
  },
  modules: {},
});
