<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import Post from "./routes/Post.svelte";

  export let url = "";
</script>

<style>
  main {
    text-align: center;
    max-width: 640px;
    margin: 0 auto;
  }
</style>

<Router {url}>
  <main id="PageContainer">
    <Route path="/post/:shortcode" component={Post} />
    <Route path="/" component={Home} />
  </main>
</Router>
