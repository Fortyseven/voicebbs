<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import Post from "./routes/Post.svelte";

  export let url = "";
</script>

<style lang="scss">
  main {
    text-align: center;
    max-width: 640px;
    margin: 0 auto;

    h1 a {
      color: gold;
      font-family: monospace;
    }
    .disclaimer {
      font-size: 8pt;
    }
  }
</style>

<Router {url}>
  <main id="PageContainer">
    <h1>
      <a href="/">-=[ Voice BBS ]=-</a>
    </h1>
    <h5>
      Leave weird, semi-anonymous voice messages! It's the bathroom wall of
      cyberspace. Get creative!
      <br />
      <br />
      (Messages will
      <i>eventually</i>
      be deleted after 24-48 hours, but this is still being worked out. Fow now,
      they'll stay until the janitor purges the queue manually.)
    </h5>
    <h4>This is a work in progress!</h4>
    <p class="disclaimer">
      (Most mobile and desktop browsers are supported, but iOS/macOS Safari is
      currently broken.)
    </p>

    <Route path="/post/:shortcode" component={Post} let:param />
    <Route path="/" component={Home} />
  </main>
</Router>
