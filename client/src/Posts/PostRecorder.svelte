<script>
  import PostRecorderUI from "./PostRecorderUI.svelte";

  // export let streamObj;
  export let onSaved = undefined;
  export let onClose;
</script>

<style>
  recorder {
    width: 400px;
    margin: auto;
  }
</style>

<recorder>
  <!-- {#if visible} -->
  <fieldset class="post-recorder window">
    <legend>Record a New Post</legend>
    <PostRecorderUI {onSaved} {onClose} />
  </fieldset>
  <!-- {/if} -->
</recorder>
