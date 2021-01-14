<script>
  import { API_HOST } from "../config.js";
  import moment from "moment";
  import { play, spinner, stop, link } from "svelte-awesome/icons";
  import { link as route_link } from "svelte-routing";
  import ProgressMeter from "../ui/ProgressMeter.svelte";
  import PostRepliesList from "./PostRepliesList.svelte";
  import PostRecorderUI from "./PostRecorderUI.svelte";
  import Avatar from "../ui/Avatar.svelte";
  import Icon from "svelte-awesome";

  import api from "../api";

  export let post_shortcode;
  export let full = false;
  export let is_reply = false;

  let post_data = undefined;
  let audio_element = undefined;
  let is_playing = false;
  let avatar_png = undefined;
  let show_reply_controls = false;

  let cur_time = 0;

  const NEW_POST_HOURS = 8;

  $: if (audio_element && !post_data) {
    api.post
      .getDetails(post_shortcode)
      .then(res => res.json())
      .then(data => {
        post_data = data;
      });
  }

  async function loadBlob(shortcode) {
    api.post
      .getBlob(shortcode)
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
      post_data.play_count++; // we can fake this, since it'll be the same on the backend
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
    cur_time = post_data.duration;
    audio_element.pause();
    is_playing = false;
  }

  function onTimeUpdate(v) {
    cur_time = audio_element.currentTime;
  }

  function openReplyControls() {
    show_reply_controls = true;
  }

  function onSaved() {
    show_reply_controls = false;
    post_data.reply_count++;
    window.location.href = `/post/${post_data.shortcode}`;
  }

  function isNew() {
    return moment(post_data.timestamp)
      .add(NEW_POST_HOURS, "hours")
      .isAfter(Date.now());
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
      .new {
        color: gold;
        font-weight: bold;
        text-shadow: 0 0 10px #202b38;
      }
      .timestamp,
      .duration,
      .plays,
      .actions {
        flex: 1 1 33%;
        align-self: center;
        font-size: 0.75rem;
        button.reply {
          padding: 0.25em 1em;
          margin: unset;
        }
        a {
          color: gold;
          &:hover {
            text-decoration: none;
          }
          &:visited {
            color: unset;
          }
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
      <span
        style="width: 100%"
        on:click={() => {
          window.location.href = `/post/${post_data.shortcode}`;
        }}>
        <ProgressMeter
          bind:value={cur_time}
          max_value={post_data.duration}
          {is_playing} />
      </span>
      <div class="link">
        {#if !is_reply}
          <a href="/post/{post_data.shortcode}" use:route_link>
            <Icon data={link} />
          </a>
        {/if}
      </div>
    </div>

    <div class="post-meta">
      <div
        class="timestamp"
        title={moment(post_data.timestamp).local()}
        class:new={isNew()}>
        {moment(post_data.timestamp).fromNow()}
      </div>
      <div class="duration">
        {post_data.duration ? post_data.duration.toFixed(2) + 's' : '--'}
      </div>
      <div class="plays">
        <span title="Plays">👂 {post_data.play_count}</span>
        {#if !is_reply}|{/if}
        <span title="Replies">
          {#if !is_reply}
            <a href="/post/{post_data.shortcode}" use:route_link>
              🔥 {post_data.reply_count}
            </a>
          {/if}
        </span>
      </div>
      <div class="actions">
        {#if !is_reply}
          <button class="reply" on:click={() => openReplyControls()}>
            reply
          </button>
        {/if}
      </div>

    </div>

    {#if show_reply_controls}
      <div class="reply-controls">
        <PostRecorderUI reply_to={post_shortcode} {onSaved} />
      </div>
    {/if}
  </div>
  {#if !is_reply && full}
    <fieldset>
      <legend>Replies</legend>
      <PostRepliesList parent_shortcode={post_shortcode} />
    </fieldset>
  {/if}
{/if}
