import { GrGoogle } from "react-icons/gr";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login({logged, setLogged}) {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="border-solid border-2 border-slate-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center w-full h-fit py-4 px-4 bg-slate-100 items-center mx-auto rounded-md shadow-lg">
      <button className="flex items-center justify-around w-3/4 bg-gradient-to-r from-[#493720] to-[#271E11] p-1 opacity-70 rounded-md text-slate-100 text-sm border-solid border-2 border-[#493720]"
        onClick={() => {
          if (!user) {
            GoogleLogin()
        }}}
      >
        Sign in with Google
        <GrGoogle size={30} className="googleIcon" />
      </button>
    </div>
  );
}
