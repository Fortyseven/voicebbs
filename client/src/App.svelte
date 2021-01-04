<script>
  import PostList from "./Posts/PostList.svelte";
  import PostRecorder from "./Posts/PostRecorder.svelte";

  let ready = false;
  let mediaStreamObj = undefined;
  let updated = 1;
  let recordVisible = false;
</script>

<style>
  main {
    text-align: center;
    max-width: 640px;
    margin: 0 auto;
  }
</style>

<main>
  <h1>Voice BBS</h1>
  <h4>This is a work in progress and is not ready for public use yet.</h4>
  {#if recordVisible}
    <PostRecorder onSaved={() => updated++} />
  {:else}
    <button on:click={() => (recordVisible = true)}>Record a New Post</button>
  {/if}
  <hr />
  <PostList {updated} />
</main>
