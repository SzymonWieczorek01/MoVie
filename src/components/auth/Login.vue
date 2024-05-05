<template>
    <button @click="signInWithGoogle" v-if="!isLogged"> Sign-in with Google </button>
    <p v-if="isLogged">{{ userName }}</p>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    export default { 
        name: "Login",
        methods: { 
            ...mapActions(["signInWithGoogle"])
        },
        computed: {
            ...mapState(['userName', 'isLogged'])
        },
        watch: {
            isLogged(newLogged, oldLogged) {
                if (newLogged == true){
                    this.$router.push({ name: 'Home'})
                }
            }
        }
    }
</script>