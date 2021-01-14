<script>
  import PostList from "../Posts/PostList.svelte";
  import PostRecorder from "../Posts/PostRecorder.svelte";

  let ready = false;
  let mediaStreamObj = undefined;
  let updated = 1;
  let recordVisible = false;
</script>

<div id="Home">
  {#if recordVisible}
    <PostRecorder onSaved={() => updated++} />
  {:else}
    <button on:click={() => (recordVisible = true)}>Record a New Post</button>
  {/if}
  <hr />
  <PostList {updated} />
</div>
