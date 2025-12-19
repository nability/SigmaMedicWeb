import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAJXR-qy9QGH_Sst6O1o40x4seIzMhT1I",
  authDomain: "sigmamedic-79d15.firebaseapp.com",
  projectId: "sigmamedic-79d15",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
