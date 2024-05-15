<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <p>As you have watched {{ movieTitle }}, please leave a review:</p>
      <slot></slot>
      <div class="input-group">
        <label for="rating">Rate </label>
        <div class="star-rating">
          <span v-for="n in 5" :key="n" :class="{ 'star-filled': n <= rating }" @click="rating = n">★</span>
        </div>
      </div>
      <div class="input-group" :class="{ 'input-error': review.length < 10 }">
        <label for="review">Review </label>
        <textarea id="review" v-model="review"></textarea>
        <span v-if="review.length < 10" class="error-message">Review must be at least 10 characters.</span>
      </div>
      <button class="close-button" @click="hideModal">Close</button>
      <button class="submit-button" @click="submitReview">Submit</button>
    </div>
  </div>
</template>

<script>
import { collection, addDoc } from "firebase/firestore";
import { mapState, mapActions } from "vuex";

export default {
  name: "AddOpinion",
  props: {
    showModal: Boolean,
    movieTitle: String,
    movieId: Number,
    moviePosterPath: String
  },
  data() {
    return {
      rating: 1,
      review: ''
    }
  },
  computed: {
    ...mapState(['userEmail', 'fireStore']),
    isValidReview() {
      return this.review.length >= 10;
    }
  },
  methods: {
    ...mapActions(['getUserWatchedMovies']),
    hideModal() {
      this.$emit("close");
    },
    submitReview() {
      if (this.isValidReview && this.rating >= 1 && this.rating <= 5) {
        var movieData = {
          id: parseInt(this.movieId),
          title: this.movieTitle,
          poster_path: this.moviePosterPath,
          user_email: this.userEmail,
          rating: this.rating,
          review: this.review
        }
        addDoc(collection(this.fireStore, "watched_movies"), movieData)
        .then(doc => {
          movieData['dbId'] = doc.id
          this.$store.commit("setUserWatchedMovies", movieData)
        });
        this.$emit("submit", movieData);
      }
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  text-align: left;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  background-color: #f4f4f7;
  padding: 25px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 4px 4px 8px #dcdde1, -4px -4px 8px #ffffff;
  transition: transform 0.3s ease-in-out;
}

.input-group {
  margin-bottom: 20px;
}

.star-rating {
  display: inline-block;
  font-size: 1.5em;
  color: #cfcfd4; 
  cursor: pointer;
}

.star-rating .star-filled {
  color: #ffd700;
  text-shadow: 0 0 3px #ffd700; 
}

input, textarea {
  width: calc(100% - 20px);
  padding: 10px;
  resize: none;
  background-color: #f4f4f7;
  border: none;
  box-shadow: inset 2px 2px 4px #dcdde1, inset -2px -2px 4px #ffffff;
  border-radius: 8px;
}

.close-button, .submit-button {
  margin-top: 20px;
  margin-right: 5px;
  padding: 10px 15px;
  font-size: 1em; 
  border-radius: 5px;
  cursor: pointer;
  color: white;
  border: none;
  transition: background-color 0.3s, transform 0.2s;
}

.close-button {
  background-color: #dc3545;
}

.close-button:hover {
  background-color: #c82333; 
  transform: scale(1.05);
}

.submit-button {
  background-color: #28a745;
}

.submit-button:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.input-error textarea {
  box-shadow: inset 2px 2px 4px #bfa2a2, inset -2px -2px 4px #ffffff;
}

.error-message {
  color: #cc444b;
  font-size: 0.8em;
  display: block;
}

@media (max-width: 600px) {
  .modal-content {
    width: 80%;
    padding: 15px;
  }
}
</style>
