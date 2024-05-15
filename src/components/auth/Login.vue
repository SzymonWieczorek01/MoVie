<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="signIn({ email: email, pass: pass })" class="login-form">
        <div class="input-group">
            <label for="email"><i class="fas fa-envelope"></i> Email</label>
            <input id="email" type="email" v-model="email" placeholder="Enter your email" required />
        </div>
        <div class="input-group">
            <label for="password"><i class="fas fa-lock"></i> Password</label>
            <input id="password" type="password" v-model="pass" placeholder="Create a password" required minlength="6" />
        </div>
        <button type="submit" :disabled="isButtonDisabled">Login</button>
        <button @click="signInWithGoogle" v-if="!isLogged">
            <i class="fab fa-google"></i> Sign-in with Google
        </button>
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="error-message" v-if="signInErrorMessage">{{ signInErrorMessage }}</p>
    </form>
  </div>
</template>


<script>
    import { mapState, mapActions } from 'vuex';
    export default {
        data () {
            return {
                email: '',
                pass: '',
                errorMessage: ''
            }
        },
        name: "Login",
        methods: { 
            ...mapActions(["signInWithGoogle", "signIn"])
        },
        computed: {
            ...mapState(['userName', 'isLogged', 'signInErrorMessage']),
            isButtonDisabled(){
                return this.email.length == 0 || this.pass.length < 6
            }
        },
        watch: {
            isLogged(newLogged, oldLogged) {
                if (newLogged == true){
                    this.$router.push({ name: 'Home'})
                }
            },
            pass(newPass, oldPass) {
                if (newPass.length < 6){
                    this.errorMessage = "Must be at least 6 characters!"
                }
                if (newPass.length == 0 || newPass.length >= 6){
                    this.errorMessage = ""
                }
            }
        }
    }
</script>

<style scoped>
.login-container {
  display: flex;
  margin-top: -70px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 5px;
}

i {
  margin-right: 10px;
  color: #4a67d6;
}

input[type="email"],
input[type="password"] {
  padding: 12px; /* Increased padding to extend until the border */
  border: 1px solid #ccc;
  border-radius: 4px;
  width: calc(100% - 24px); /* Adjusted width to consider padding */
}

button {
  padding: 10px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: 500;
  color: white;
  background: linear-gradient(90deg, rgba(213, 149, 255, 0.788) 0.3%, #30345afd 100.05%, #30345a42 100.06%);
  border: none;
  border-radius: 20px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 1s ease;
}

button:disabled {
  background-color: #a0b1d1;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: white;
  color:black;
  border: 1px solid;
  border-color: rgb(145, 56, 187);
}

.error-message {
  color: #d9534f;
  font-size: 0.9rem;
}

h2 {
  margin-bottom: 20px;
}
</style>
