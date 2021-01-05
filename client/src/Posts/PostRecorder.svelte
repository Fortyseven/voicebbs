<script>
  import { API_HOST } from "../config.js";
  import MediaSetup from "../media/MediaSetup.svelte";
  import Icon from "svelte-awesome";
  import { play, spinner, stop, circle, save } from "svelte-awesome/icons";

  export let streamObj;
  export let onSaved;
  export let onClose;

  let ready = false;

  let mediaRecorder = undefined;
  let audioUrl = "";
  let audioCtrl = undefined;
  let blob = undefined;
  let isRecording = false;
  let chunks = [];

  $: {
    if (streamObj) {
      mediaRecorder = new MediaRecorder(streamObj, {
        audioBitsPerSecond: 8000
      });
      bindMediaCallbacks();
    }
  }

  function bindMediaCallbacks() {
    mediaRecorder.ondataavailable = function(ev) {
      console.log("got some data", ev);
      chunks.push(ev.data);
    };
    mediaRecorder.onstop = async function(ev) {
      console.log("writing chunks");
      blob = new Blob(chunks, { type: "audio/mp3;" });
      audioUrl = window.URL.createObjectURL(blob);
      console.log(audioUrl, blob);
      audioCtrl.src = audioUrl;
      chunks = [];
    };
    console.log(mediaRecorder);
  }

  function onRecordStart() {
    chunks = [];
    mediaRecorder.start();
    isRecording = true;
  }

  function onRecordStop() {
    mediaRecorder.stop();
    isRecording = false;
  }

  function onPlayClick() {
    if (audioUrl) {
      audioCtrl.play();
    }
  }
  async function savePost(blob) {
    const reader = new FileReader();

    reader.readAsDataURL(blob);

    reader.onloadend = async function() {
      const output = {
        duration: audioCtrl.duration,
        blob: reader.result
      };

      const res = await fetch(`https://${API_HOST}/api/v1/post`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(output)
      });
      audioUrl = "";
      audioCtrl.src = "";
      onSaved();
    };
  }

  function onCloseClick() {
    chunks = [];
    blob = undefined;
    audioUrl = "";
    visible = false;
  }
</script>

<style>
  #Recorder {
    width: 400px;
    margin: auto;
  }
</style>

<div id="Recorder">
  <MediaSetup bind:isReady={ready} bind:streamObj />
  <fieldset class="post-recorder window">
    <legend>Record a New Post</legend>
    {#if !ready}
      <p>Waiting for browser permission...</p>
    {:else}
      <audio bind:this={audioCtrl} />
      {#if !isRecording}
        <button
          on:click={onRecordStart}
          style="color:red"
          title="Begin Recording">
          <Icon data={circle} />
        </button>
      {:else}
        <button on:click={onRecordStop} title="Stop Recording">
          <Icon data={stop} />
        </button>
      {/if}
      <button
        on:click={onPlayClick}
        style="color:green"
        disabled={!audioUrl}
        title="Play Recording">
        <Icon data={play} />
      </button>
      <button
        on:click={savePost(blob)}
        disabled={!audioUrl}
        title="Post Recording"
        style="color:yellow">
        <!-- Post -->
        <Icon data={save} class="save" />
      </button>
    {/if}
  </fieldset>
</div>
