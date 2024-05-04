<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <p>As you have watched {{ movieTitle }}, please leave a review:</p>
      <slot></slot>
      <div class="input-group">
        <label>Rate </label>
        <div class="star-rating">
          <span v-for="n in 5" :class="{ 'star-filled': n <= rating }" @click="rating = n">★</span>
        </div>
      </div>
      <div class="input-group" :class="{ 'input-error': review.length < 10 }">
        <label>Review </label>
        <textarea v-model="review"></textarea>
        <span v-if="review.length < 10" class="error-message">Review must be at least 10 characters.</span>
      </div>
      <button class="close-button" @click="hideModal">Close</button>
      <button class="submit-button" @click="submitReview">Submit</button>
    </div>
  </div>
</template>

<script>
import { collection, addDoc } from "firebase/firestore";
import { mapState } from "vuex";

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
    hideModal() {
      this.$emit("close");
    },
    submitReview() {
      if (this.isValidReview && this.rating >= 1 && this.rating <= 5) {
        console.log(`Rating: ${this.rating}, Review: ${this.review}`);
        addDoc(collection(this.fireStore, "watched_movies"), {
          film_id: this.movieId,
          film_name: this.movieTitle,
          poster_path: this.moviePosterPath,
          user_email: this.userEmail,
          rating: this.rating,
          review: this.review
      });
        this.$emit("submit");
      }
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: start;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 50%;
  
}

.input-group {
  margin-bottom: 10px;
}

.star-rating {
  display: inline-block;
  font-size: 1.5em;
  color: #d3d3d3;
  cursor: pointer;
}

.star-rating .star-filled {
  color: #ffd700;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
}

.close-button, .submit-button {
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-button {
  background-color: red;
  color: white;
}

.submit-button {
  background-color: green;
  color: white;
}

.input-error textarea {
  border: 2px solid red;
}

.error-message {
  color: red; 
  font-size: 0.8em; 
}
</style>
