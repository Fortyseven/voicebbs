<script>
  import PostPlayer from "./PostPlayer.svelte";
  import { API_HOST } from "../config.js";

  export let updated;
  let posts = [];

  $: if (updated) {
    fetch(`https://${API_HOST}/api/v1/posts`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        console.log("POSTS", data);
        posts = data;
      });
  }
</script>

<style>
  fieldset {
    border: none;
  }
  legend {
    text-align: center;
  }
</style>

<fieldset>
  <legend>Latest Posts</legend>
  {#each posts as post}
    <PostPlayer bind:post_shortcode={post.shortcode} />
  {/each}
</fieldset>
