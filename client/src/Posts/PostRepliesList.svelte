<script>
  import PostPlayer from "./PostPlayer.svelte";
  import { API_HOST } from "../config.js";
  import { onMount } from "svelte";

  export let updated = false;
  export let parent_shortcode;

  let replies = [];

  onMount(() => {
    reload();
  });

  function reload() {
    fetch(`https://${API_HOST}/api/v1/posts/${parent_shortcode}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        // console.log("POSTS", data);
        replies = data;
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

{#if !replies.length}
  <p>No replies.</p>
{:else}
  {#each replies as reply}
    <PostPlayer
      full="false"
      is_reply="true"
      bind:post_shortcode={reply.shortcode} />
  {/each}
{/if}
