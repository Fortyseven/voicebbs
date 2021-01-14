<script>
  import PostPlayer from "../Posts/PostPlayer.svelte";
  export let shortcode;
</script>

<div>
  <PostPlayer post_shortcode={shortcode} full="true" />
</div>
