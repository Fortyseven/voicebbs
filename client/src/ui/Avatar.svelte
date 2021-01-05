<script>
  import Identicon from "identicon.js";

  export let value = undefined;
  let avatar_png = undefined;

  const identicon_options = {
    background: [255, 255, 255, 20],
    size: 32,
    format: "svg"
  };

  $: if (value) {
    avatar_png = new Identicon(value, identicon_options);
  }
</script>

<style>
  avatar {
    width: 32px;
    height: 32px;
  }
</style>

<avatar style="background-image:url(data:image/svg+xml;base64,{avatar_png})" />
