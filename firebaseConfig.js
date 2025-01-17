import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "AIzaSyAj05HHWlU7e8XN47iCJ76m-O9gt0B5P8c",
     authDomain: "projektappli.firebaseapp.com",
     projectId: "projektappli",
     storageBucket: "projektappli.firebasestorage.app",
     messagingSenderId: "747708685835",
     appId: "1:747708685835:web:38fe1c2f6939e1ca46b10e"
    };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};