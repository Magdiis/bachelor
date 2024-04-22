import {auth } from "@/firebase-service";
import {onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile,updateEmail,updatePassword, deleteUser,signOut} from "firebase/auth";
import {AuthResponse} from "@/model/auth/AuthResponse";
import managePreferences, {preferencesKeys} from "@/composables/localStorage/managePreferences";

export default function authentication() {
    async function createProfile(email: string, password: string):Promise<AuthResponse>{
        try {
            const user = await createUserWithEmailAndPassword(auth,email,password)
            return {
                errorMessage: "", user: user
            }
        } catch (error:any) {
            console.log(error.code)
            switch (error.code) {
                case 'auth/email-already-in-use':
                    return {
                        errorMessage: "Zadaný e-mail už existuje.", user: null
                    }
                case 'auth/invalid-email':
                    return {
                        errorMessage: "Špatně zadaný e-mail.", user: null
                    }
                case 'auth/weak-password':
                    return {
                        errorMessage: "Slabé heslo. Heslo musí být dlouhé alespoň 6 znaků.", user: null
                    }
                default:
                    return {
                        errorMessage: "Chyba", user: null
                    }
            }
        }
    }

     async function signIn(email: string, password: string): Promise<AuthResponse> {
         try {
             const user = await signInWithEmailAndPassword(auth, email, password)
             await (managePreferences().setPreferences(preferencesKeys.isUserLogged, true))

             return {
                 errorMessage: "", user: user
             }
         } catch (error: any) {
             console.log(error.code)
             switch (error.code) {
                 case 'auth/invalid-credential':
                     return {
                         errorMessage: "Chybně zadané heslo nebo e-mail.", user: null
                     }
                 case 'auth/invalid-email':
                     return {
                         errorMessage: "Chybný formát e-mailu.", user: null
                     }
                 case 'auth/invalid-password':
                     return {
                         errorMessage: "Špatné heslo", user: null
                     }
                 default:
                     return {
                         errorMessage: "Chyba", user: null
                     }
             }
         }
     }

    function logout(){
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            console.error(error.code,", ",error.message)
        });
    }

     function isUserLoggedIn(): boolean{
        // onAuthStateChanged(auth,(user) => {
        //     if(user){
        //         return true
        //     } else {
        //         return false
        //     }
        // })
         return !!auth.currentUser
    }

    // const getCurrentAuthUserID = new Promise<void>((resolve) => {
    //     onAuthStateChanged(auth, (authUser) => {
    //         user.id = authUser?.uid
    //         resolve()
    //     })
    // })

    /* OBSERVE USER STATE. Get the currently signed-in use
                const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
              if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                // ...
              } else {
                // User is signed out
                // ...
              }
            });


     */
    // function getCurrentSignInUser(): User | null {
    //     const user = auth.currentUser
    //     return user
    // }

    function updateProfileNameORPhoto(displayName: string, photoURL: string){
        if (auth.currentUser) {
            updateProfile(auth.currentUser, {
                displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
            }).then(() => {
                // Profile updated!
                // ...
            }).catch((error) => {
                // An error occurred
                // ...
            });
        }
    }

    function updateAuthEmail(newEmail: string){
        if (auth.currentUser) {
            updateEmail(auth.currentUser, newEmail).then(() => {
                // Email updated!
                // ...
            }).catch((error) => {
                // An error occurred
                // ...
            });
        }
    }
    function updateAuthPassword(newPassword: string){
        if (auth.currentUser) {
            updatePassword(auth.currentUser, newPassword).then(() => {
                // Update successful.
            }).catch((error) => {
                // An error ocurred
                // ...
            });
        }
    }

    function deleteProfile(){
        if (auth.currentUser) {
            deleteUser(auth.currentUser).then(() => {
                // User deleted.
            }).catch((error) => {
                // An error ocurred
                // ...
            });
        }
    }

    /* Re-authenticate a user
        Some security-sensitive actions—such as deleting an account, setting a primary email address, and changing a
        password—require that the user has recently signed in. If you perform one of these actions,
        and the user signed in too long ago, the action fails with an error.
        When this happens, re-authenticate the user by getting new sign-in credentials from the user and
        passing the credentials to reauthenticateWithCredential. For example:

     */
    return {createProfile, deleteProfile, logout, signIn, isUserLoggedIn}
}