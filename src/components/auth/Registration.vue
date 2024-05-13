<template>
  <div class="signup-container">
    <h2>Create Your Account</h2>
    <form @submit.prevent="createUser({ email: email, pass: pass })" class="signup-form">
      <div class="input-group">
        <label for="email"><i class="fas fa-envelope"></i> Email</label>
        <input id="email" type="email" v-model="email" placeholder="Enter your email" required />
      </div>

      <div class="input-group">
        <label for="password"><i class="fas fa-lock"></i> Password</label>
        <input id="password" type="password" v-model="pass" placeholder="Create a password" required minlength="6" />
      </div>

      <div class="input-group">
        <label for="confirm-password"><i class="fas fa-check-circle"></i> Confirm Password</label>
        <input id="confirm-password" type="password" v-model="confirmPass" placeholder="Confirm your password" required minlength="6" />
      </div>

      <button type="submit" :disabled="isButtonDisabled">Register</button>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      <p class="error-message" v-if="signUpErrorMessage">{{ signUpErrorMessage }}</p>
    </form>
    <p v-if="isLogged">{{ userName }}</p>
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';

export default { 
    data (){
        return {
            email: '',
            pass: '',
            confirmPass: '',
            errorMessage: ''
        }
    },
    name: "SignUp",
    methods: { 
        ...mapActions(["createUser"]),
        checkPasswords() {
            if (this.pass !== this.confirmPass) {
                this.errorMessage = "Passwords do not match!\n";
            }
            else {
                this.errorMessage = "";
            }
        }
    },
    computed: {
        ...mapState(['isLogged', 'userName', 'signUpErrorMessage']),
        isButtonDisabled(){
            return this.email.length == 0 || this.pass.length < 6 || this.pass !== this.confirmPass;
        }
    },
    watch: {
        pass() {
            if (this.pass.length < 6 && this.pass.length>0) {
                this.errorMessage = "Password should be at least 6 characters\n";
            } else {
                this.errorMessage = "";
            }
        },
        confirmPass() {
            this.checkPasswords();
        },
        isLogged(newLogged) {
          this.$router.push({name: "Home"})
        }
    },
    created() {
      if (this.isLogged) {
        this.$router.push({name: "Home"})
      }
    }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  color: #333;
}

.signup-form {
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

input[type="email"], input[type="password"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  color: white;
  background-color: #4a67d6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #a0b1d1;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #3658b3;
}

.error-message {
  color: #d9534f;
  font-size: 0.9rem;
}

h2 {
  margin-bottom: 20px;
}
</style>

