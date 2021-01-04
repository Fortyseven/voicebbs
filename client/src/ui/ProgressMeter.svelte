<script>
  export let value = 0;
  export let max_value = 100;
  export let is_playing = false;

  let innerEl = undefined;

  $: {
    if (innerEl && value && max_value) {
      let new_width = (100 / max_value) * value;
      innerEl.style.width = `${new_width}%`;
    }
  }

  $: {
    if (is_playing) {
      if (innerEl && !innerEl.classList.contains("playing")) {
        innerEl.style.width = "0%";
        innerEl.classList.add("playing");
      }
    } else {
      if (innerEl) {
        innerEl.classList.remove("playing");
      }
    }
  }
</script>

<style lang="scss">
  progressmeter {
    display: inline-block;
    width: auto;
    background-color: #273444;
    flex: 1 1 auto;

    .inner {
      width: 0%;
      height: 100%;
      background-color: goldenrod;
      transition: width 300ms linear;
    }
  }
</style>

<progressmeter>
  <div bind:this={innerEl} class="inner" />
</progressmeter>
