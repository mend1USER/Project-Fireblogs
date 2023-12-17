//Здесь мы вставляем те конфиги которые нам написали на Firebase импортируя их и экспортируя их для других компонентов

import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdhACtI5myvmzoQiGw-bnh7lOyyc0RsB0",
  authDomain: "fir-project-b4077.firebaseapp.com",
  projectId: "fir-project-b4077",
  storageBucket: "fir-project-b4077.appspot.com",
  messagingSenderId: "218908098330",
  appId: "1:218908098330:web:34f2cf5a125ccf3dc2b6a3",
  measurementId: "G-XG264M8BL2",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
//timestamp это свойство в файрбаз которое может предствалять точное дата и время когда пользователь опубликовал пост или регистрировал свой аккаунт
//и мы назначаем его в переменную и экпортируем его
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();
