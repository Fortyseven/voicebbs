<script>
  import { API_HOST } from "../config.js";
  import moment from "moment";
  import ProgressMeter from "../ui/ProgressMeter.svelte";
  import Avatar from "../ui/Avatar.svelte";
  import Icon from "svelte-awesome";
  import { play, spinner, stop, link } from "svelte-awesome/icons";

  export let post_shortcode;
  let post_data = undefined;
  let audio_element = undefined;
  let is_playing = false;
  let avatar_png = undefined;

  let cur_time = 0;

  $: if (audio_element && !post_data) {
    fetch(`https://${API_HOST}/api/v1/post/${post_shortcode}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        post_data = data;
      });
  }

  async function loadBlob(shortcode) {
    await fetch(`https://${API_HOST}/api/v1/post-blob/${shortcode}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        audio_element.src = data.blob;
        is_playing = false;
        onPlayClick();
      });
  }

  async function onPlayClick() {
    if (!audio_element.src) {
      loadBlob(post_data.shortcode);
      return;
    }

    if (is_playing) {
      onPlaybackEnded();
    } else {
      audio_element.play();
      is_playing = true;
    }
  }

  function onPlaybackEnded() {
    console.log("finished");
    cur_time = post_data.duration;
    audio_element.pause();
    is_playing = false;
  }

  function onTimeUpdate(v) {
    cur_time = audio_element.currentTime;
  }
</script>

<style lang="scss">
  .post-player-entry {
    background-color: #26303d;
    padding: 0.15rem 0.5rem;
    margin: 0.25em;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    :global(avatar) {
      margin-right: 0.5em;
    }
    .post-player-top,
    .post-meta {
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 0.25em;

      button.play {
        flex: 0 0 1em;
        align-self: center;
        padding: 0.25em 1em;
        margin: 0;
        margin-right: 0.5em;
      }
      :global(progressmeter) {
        margin-right: 0.5em;
        display: block;
        height: 1.5em;
        align-self: center;
      }

      .link {
        flex: 0 1 auto;
        align-self: center;
        button {
          padding: 0.25em 1em;
          margin: 0;
        }
      }
    }
    .post-meta {
      display: flex;
      margin: 0.25em 3em;
      .timestamp,
      .duration,
      .actions {
        flex: 1 1 33%;
        align-self: center;
        font-size: 0.75rem;
        button.reply {
          padding: 0.25em 1em;
          margin: unset;
        }
      }
      .timestamp {
        text-align: left;
      }
      .actions {
        text-align: right;
      }
    }
  }
</style>

<audio
  bind:this={audio_element}
  on:ended={onPlaybackEnded}
  on:timeupdate={onTimeUpdate} />
{#if post_data}
  <div class="post-player-entry">
    <div class="post-player-top" data-post-shortcode={post_data.shortcode}>
      <button class="play" on:click={onPlayClick}>
        {#if is_playing}
          <Icon data={stop} />
        {:else}
          <Icon data={play} />
        {/if}
      </button>

      <Avatar value={post_data.ip_hash} />

      <ProgressMeter
        bind:value={cur_time}
        max_value={post_data.duration}
        {is_playing} />

      <div class="link">
        <a href="/post/{post_data.shortcode}" use:route_link>
          <Icon data={link} />
        </a>
      </div>
    </div>
    <div class="post-meta">
      <div class="timestamp">{moment(post_data.timestamp).fromNow()}</div>
      <div class="duration">
        {post_data.duration ? post_data.duration.toFixed(2) + 's' : '--'}
      </div>
      <div class="actions">
        <button class="reply" on:click={() => alert('soon')}>reply</button>
      </div>
    </div>
  </div>
{/if}
