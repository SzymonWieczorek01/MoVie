<template>
    <input type="text" v-model="email" placeholder="Email" />
    <input type="password" v-model="pass" placeholder="Password" />
    <button @click="createUser({email: email, pass: pass})" :disabled="isButtonDisabled">Register</button>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if='signUpErrorMessage'>{{ signUpErrorMessage }}</p>
    <p v-if="isLogged">{{ userName }}</p>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    export default { 
        data (){
            return {
                email: '',
                pass: ''
            }
        },
        name: "SignUp",
        methods: { 
            ...mapActions(["createUser"])
        },
        computed: {
            ...mapState(['isLogged', 'signUpErrorMessage']),
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