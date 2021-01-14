<script>
  import MediaSetup from "../media/MediaSetup.svelte";
  import Icon from "svelte-awesome";
  import { play, spinner, stop, circle, save } from "svelte-awesome/icons";
  import api from "../api";

  export let onSaved = undefined;
  export let reply_to = undefined;

  const RECORDING_RATE = 8000;
  // const RECORDING_CODEC = "audio/webm; codecs=opus";
  // const RECORDING_CODEC = "audio/webm";
  // const RECORDING_CODEC = "audio/mpeg";

  let has_permission = false;

  let streamObj = undefined;
  let mediaRecorder = undefined;
  let audioUrl = "";
  let audioCtrl = undefined;
  let blob = undefined;
  let isRecording = false;
  let chunks = [];
  let duration = undefined;

  $: {
    if (streamObj) {
      mediaRecorder = new MediaRecorder(streamObj, {
        audioBitsPerSecond: RECORDING_RATE,
        // mimeType: RECORDING_CODEC,
        audioBitrateMode: "vbr"
      });
      bindMediaCallbacks();
    }
  }

  /**********************************************************************/
  function bindMediaCallbacks() {
    mediaRecorder.ondataavailable = function(ev) {
      console.log("got some data", ev);
      chunks.push(ev.data);
    };
    mediaRecorder.onstop = async function(ev) {
      console.log("writing chunks");
      blob = new Blob(chunks, { type: "audio/webm; codecs=opus;" });
      audioUrl = window.URL.createObjectURL(blob);
      console.log(audioUrl, blob);
      audioCtrl.src = audioUrl;
      chunks = [];
    };
    console.log(mediaRecorder);
  }

  /**********************************************************************/
  function onRecordStart() {
    chunks = [];
    mediaRecorder.start();
    startRecordingTimer();
    isRecording = true;
  }

  function onRecordStop() {
    mediaRecorder.stop();
    duration = stopRecordingTimer();
    isRecording = false;
    console.log("recorded for", duration);
  }

  function onPlayClick() {
    if (audioUrl) {
      audioCtrl.play();
    }
  }

  function onCloseClick() {
    chunks = [];
    blob = undefined;
    audioUrl = "";
  }

  /**********************************************************************/
  async function savePost(blob) {
    const reader = new FileReader();

    reader.readAsDataURL(blob);

    reader.onloadend = async function() {
      console.log(audioCtrl, duration);
      api.post.saveNewAudioPost(reader.result, duration, reply_to).then(res => {
        audioUrl = "";
        audioCtrl.src = "";
        if (typeof onSaved === "function") {
          onSaved();
        }
      });
    };
  }

  /**********************************************************************/
  let _record_start_time = undefined;

  function startRecordingTimer() {
    _record_start_time = Date.now();
  }

  function stopRecordingTimer() {
    return (Date.now() - _record_start_time) / 1000;
  }
</script>

<recorderui>
  <MediaSetup bind:isReady={has_permission} bind:streamObj />
  {#if !has_permission}
    <p>Waiting for browser permission...</p>
  {:else}
    <audio bind:this={audioCtrl} preload="auto" />
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
</recorderui>
