<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'

</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/sampleone">챌린지 1 (반응성)</RouterLink>
        <RouterLink to="/sampletwo">챌린지 2 (보간법)</RouterLink>
        <RouterLink to="/samplethree">챌린지 3 (v-html)</RouterLink>
        <RouterLink to="/samplefour">챌린지 4 (XSS)</RouterLink>
        <RouterLink to="/samplefive">챌린지 5 (v-text)</RouterLink>
        <RouterLink to="/samplesix">챌린지 6 (v-bind)</RouterLink>
        <RouterLink to="/sampleseven">챌린지 7 (클래스)</RouterLink>
        <RouterLink to="/sampleeight">챌린지 8 (스타일)</RouterLink>
        <RouterLink to="/samplenine">챌린지 9 (단축문법)</RouterLink>
        <RouterLink to="/sampleten">챌린지 10 (v-if)</RouterLink>
        <RouterLink to="/sampleeleven">챌린지 11 (v-for/v-show)</RouterLink>
        <RouterLink to="/sampletwelve">챌린지 12 (특수디렉티브)</RouterLink>
        <RouterLink to="/samplethirteen">챌린지 13 (이벤트)</RouterLink>
        <RouterLink to="/samplefourteen">챌린지 14 (v-model)</RouterLink>
        <RouterLink to="/samplefifteen">챌린지 15 (스타일링)</RouterLink>
        <RouterLink to="/weather-mockup">🌤️ 과제 1: 날씨 Mockup</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
